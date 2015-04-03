(function($) {
    'use strict';

    var scripturl = '//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js';

    var chartGimmick = {
        name: 'chart',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'chart', chart);

            // load the chart js
            $.md.registerScript(this, scripturl, {
                license: 'MIT',
                loadstage: 'skel_ready',
                finishstage: 'gimmick'
            });
        }
    };
    $.md.registerGimmick(chartGimmick);

    var log = $.md.getLogger();

    function chart($links, opt, text) {
        return $links.each (function (i, link){

            // Get the options for this gimmick
            //      labelColumn: This is a string the indicates the column that will be used to
            //                   label the data points
            //      dataColumns: This is a array of strings that indicate each column to be plotted
            //      canvasId:    This is a ID for the given chart. Defaults to a random number
            //                   between 1-1000.
            //      chartOptions: This is an object that is passed to chartjs to configure its
            //                    options.
            //      chartType:   This string is the type of chart we want to render. Bar, Line,
            //                   or Radar. Defaults to Line.
            var default_options = {
                chartType: 'Line',
                canvasId: 'chartGimmick' + Math.floor((Math.random() * 1000) + 1),
                chartOptions: {
                    responsive: false
                }
            };
            var options = $.extend ({}, default_options, opt);

            var $link = $(link);

            var table = $link.parents().find("table").last();
            if (table.length === 0) {
                log.error('Chart Gimmick: No tables found on the page.');
                $link.remove();
                return;
            }

            // Replace the Gimmick with the canvas that chartJS needs
            var myHtml = $('<canvas id="' + options.canvasId + '"></canvas>');
            myHtml.width(options.width || '450px');
            myHtml.height(options.height || '250px');
            $link.replaceWith(myHtml);

            // This is the object that is given to the chart frame work for rendering. It will be
            // built up by processing the html table that is found on the table.
            var chartConfig = {
                "datasets": [],
                "labels": []
            };

            var chartAvailableToRender = true;

            // These variables hold the indices of the columns in the table we care about. They will
            // be populated as we process the table based on the options that are given in the
            // gimmick
            var labelColumnIndex = -1;
            var dataColumnIndices = [];

            // Get the index of the columns that we care about for charting
            table.find("th").each(function(index){

                // This is the column that labels each data point
                if(this.textContent === options.labelColumn) {
                    labelColumnIndex = index;
                }

                // Check if this is a data column
                else {
                    for(var i = 0; i < options.dataColumns.length; i++) {
                        if(this.textContent === options.dataColumns[i]) {
                            dataColumnIndices.push(index);
                        }
                    }
                }
            });

            // Get the data
            table.find("tr").each(function(rowIndex){
                $(this).find("td").each(function(colIndex){

                    if(colIndex === labelColumnIndex) {
                        chartConfig.labels.push(this.textContent);
                    } else {
                        for(var i = 0; i < dataColumnIndices.length; i++) {
                            if(colIndex === dataColumnIndices[i]) {

                                if(chartConfig.datasets[i] === undefined) {
                                    chartConfig.datasets[i] = {};
                                    chartConfig.datasets[i].data = [];
                                }

                                chartConfig.datasets[i].data.push(this.textContent);
                            }
                        }
                    }
                });
            });

            // No Chart data found
            if (chartConfig.datasets[i] === undefined) {
                chartAvailableToRender = false;
                log.error('Chart Gimmick: No data was found for the chart. Make sure that there ' +
                    'is a tables on the page. Check that your ' +
                    'column headers match the chart configuration.');
            }

            if (chartAvailableToRender) {
                var canvas = document.getElementById(options.canvasId);
                var ctx = canvas.getContext('2d');
                $.md.stage('postgimmick').subscribe(function(done) {
                    setTimeout(function() {
                        new Chart(ctx)[options.chartType](chartConfig, options.chartOptions);
                    });
                    done(); 
                });
            }
        });
    }

}(jQuery));
