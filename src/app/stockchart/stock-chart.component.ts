
import { Component, Input } from '@angular/core';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

import { OspreyApiService } from '../service/osprey-api.service';
import { HotListItem } from '../hotlistitem/hot-list-item'
import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service'
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: __filename,
    selector: 'stock-chart',
    directives: [CHART_DIRECTIVES],
    template: require('./stock-chart.template.html'),
    styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
    providers: [OspreyApiService, Logger]
})
export class StockChart {

    private options: HighchartsOptions;
    private chartType: string = 'candlestick';
    private item: HotListItem;

    constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {

    }
    @Input() set target(inputItem: HotListItem) {
        this.item = inputItem;
        this.doLoad();
    }

    private doLoad() {

        this.apiService.getChartData(this.item.key.symbol)
            .subscribe(
            data => {
                if (data != null) {

                    let primarySeriesData = [];
                    let volumeData = [];
                    let xCrossHairData = [];
                    let yCrossHairData = [];

                    let currentData: any;

                    for (let i = 0; i < data.payload.length; ++i) {
                        currentData = data.payload[i];

                        if (this.chartType === 'candlestick' || this.chartType == 'ohlc') {
                            primarySeriesData.push([new Date(currentData.date).getTime(), currentData.open, currentData.high, currentData.low, currentData.close]);
                        } else {
                            primarySeriesData.push([new Date(currentData.date).getTime(), currentData.adjclose]);
                        }

                        volumeData.push([new Date(currentData.date).getTime(), currentData.volume]);

                    }



                    let series: HighchartsIndividualSeriesOptions[] = []

                    // manual watch lists load for epoch time ... don't show the load date flag for these. 
                    if (new Date(this.item.reportDate) < new Date(1971, 0, 0)) {
                        series = [
                            {
                                type: this.chartType,
                                name: 'Primary',
                                id: 'dataseries',
                                data: primarySeriesData
                            }, {
                                type: 'column',
                                name: 'Volume',
                                data: volumeData,
                                yAxis: 1
                            }
                        ]
                    } else {
                        series = [
                            {
                                type: this.chartType,
                                name: 'Primary',
                                id: 'dataseries',
                                data: primarySeriesData
                            }, {
                                type: 'flags',
                                name: 'Load Date Flag',
                                data: [
                                    {
                                        x: new Date(this.item.reportDate).getTime(),
                                        title: 'Load Date'
                                    }
                                ],
                                onSeries: 'dataseries',
                                y: 50,
                                shape: 'squarepin',
                            }, {
                                type: 'column',
                                name: 'Volume',
                                data: volumeData,
                                yAxis: 1
                            }
                        ]
                    }


                    this.options = {

                        colors: ['#db4c3c', '#333333', '#333333'],

                        rangeSelector: {
                            selected: 4
                        },

                        yAxis: [
                            {
                                labels: {
                                    align: 'right',
                                    x: -3
                                },
                                title: {
                                    text: 'Price'
                                },
                                height: '60%',
                                lineWidth: 2
                            }, {
                                labels: {
                                    align: 'right',
                                    x: -3
                                },
                                title: {
                                    text: 'Volume'
                                },
                                top: '65%',
                                height: '35%',
                                offset: 0,
                                lineWidth: 2
                            }
                        ],

                        series: series,

                    };
                }
            },
            err => {
                this.clientAlertService.alertError('An error occured fetching the hot list. ' + err);
            },
            () => this.log.info('Chart load Complete')
            );


    }


}
