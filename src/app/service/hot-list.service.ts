import { Injectable } from '@angular/core';
import { HotListItem } from '../hotlistitem/hot-list-item'
import { Logger } from '../service/logger.service'

import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HotListService {

    //private HOST: string = 'http://localhost:3000';
    private HOST: string = 'http://ec2-52-90-66-65.compute-1.amazonaws.com:3000/' // TODO Extract to config

    private hotListUrl: string = this.HOST + '/api/hot-list';
    private detailSummaryUrl: string = this.HOST + '/api/detail-summary/';

    constructor(private http: Http, private log: Logger) { }

    getList(): Observable<any> {
        this.log.info(this.hotListUrl)

        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }

    getSummaryDetail(symbol: String) {
        this.log.info(this.detailSummaryUrl + symbol)

        return this.http.get(this.detailSummaryUrl + symbol)
            .map(res => res.json());
    }
}
