import { HotListItem } from '../hotlistitem/hot-list-item'
import { Logger } from '../service/logger.service'
import { Config } from '../service/config.service'

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HotListService {

    private domain: string;
    private hotListUrl: string;
    private detailSummaryUrl: string;

    constructor(private http: Http, private log: Logger, private _config: Config) {
        this.domain = _config.getAll().domain;

        this.hotListUrl = this.domain + '/api/hot-list/';
        this.detailSummaryUrl = this.domain + '/api/detail-summary/';
    }

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
