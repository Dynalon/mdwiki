(function($) {
    'use strict';

    var scripturl = 'http://www.chartjs.org/assets/Chart.js';

    var chartGimmick = {
        name: 'chart',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'chart', chart);

            // load the chart js
            $.md.registerScript(this, scripturl, {
                license: 'EXCEPTION',
                loadstage: 'skel_ready',
                finishstage: 'bootstrap'
            });
        }
    };
    $.md.registerGimmick(chartGimmick);

    function chart($links, opt, text) {
        return $links.each (function (i, link){

            // Get the options for this gimmick
            //      labelColumn: This is a string the indicates the column that will be used to
            //                   label the data points
            //      dataColumns: This is a array of strings that indicate each column to be plotted
            //      canvasId:    This is a ID for the given chart. Defaults to a random number
            //                   between 1-1000.
            var default_options = {
                canvasId: Math.floor((Math.random() * 1000) + 1)
            };
            var options = $.extend ({}, default_options, opt);

            //chartoptions
            var chartOptions = {
                responsive: true
            };

            // Replace the Gimmick with the canvas that chartJS needs
            var $link = $(link);
            var myHtml = $('<canvas id="' + options.canvasId + '" ></canvas>');
            $link.replaceWith(myHtml);

            // This is the object that is given to the chart frame work for rendering. It will be
            // built up by processing the html table that is found on the table.
            var chartConfig = {
                "datasets": [],
                "labels": []
            };

            // These variables hold the indices of the columns in the table we care about. They will
            // be populated as we process the table based on the options that are given in the
            // gimmick
            var labelColumnIndex = -1;
            var dataColumnIndices = [];

            // Get the index of the columns that we care about for charting
            // TODO JC Currently assumes that there is a single table on the page. Document this or
            //         implement a way to indicate which table
            jQuery("th").each(function(index){

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
            jQuery("tr").each(function(rowIndex){
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

            console.log(JSON.stringify(chartConfig));
            setTimeout(function(){
                new Chart(document.getElementById(options.canvasId).getContext("2d")).Line(chartConfig, chartOptions);
            }, 100);
            //var chartReference = new Chart(document.getElementById(options.canvasId).getContext("2d")).Line(chartConfig);

        });
    }

}(jQuery));
