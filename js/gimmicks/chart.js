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
            var $link = $(link);
            var myHtml = $('<canvas id="chart"></canvas>');
            $link.replaceWith(myHtml);

            // default options
            var default_options = {
                chartType: 'line',
                labelColumn: 'Sprint',
                seriesColumn: ['Avg', 'Sum']
            };
            var options = $.extend ({}, default_options, opt);

            // This is the object that is given to the chart frame work for rendering
            var chartConfig = {
                "datasets": [],
                "labels": []
            };

            var labelColumnIndex = -1;
            var dataColumnIndex = [];

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
                    for(var i = 0; i < options.seriesColumn.length; i++) {
                        if(this.textContent === options.seriesColumn[i]) {
                            dataColumnIndex.push(index);
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
                        for(var i = 0; i < dataColumnIndex.length; i++) {
                            if(colIndex === dataColumnIndex[i]) {

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

            //console.log(JSON.stringify(chartConfig));

            var chartReference = new Chart(document.getElementById("chart").getContext("2d")).Line(chartConfig);
            chartReference.update();

        });
    }

}(jQuery));
