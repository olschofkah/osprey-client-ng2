import { HotListItem } from '../hotlistitem/hot-list-item'
import { Logger } from '../service/logger.service'
import { Config } from '../service/config.service'

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OspreyApiService {

    private domain: string;
    private isAuthenticatedUrl: string;
    private hotListUrl: string;
    private detailSummaryUrl: string;
    private logoutUrl: string;

    constructor(private http: Http, private log: Logger, private _config: Config) {
        let config: any = _config.getAll() || { domain: "http://localhost:3000" };

        this.domain = config.domain;
        this.isAuthenticatedUrl = this.domain + '/api/is-authenticated';
        this.hotListUrl = this.domain + '/api/hot-list';
        this.detailSummaryUrl = this.domain + '/api/detail-summary/';

        this.logoutUrl = this.domain + '/auth/logout';

    }

    getHotList(): Observable<any> {
        this.log.info(this.hotListUrl)

        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }

    isAuthenticated(): Observable<boolean> {
        this.log.info(this.hotListUrl)

        return this.http.get(this.isAuthenticatedUrl)
            .map(res => res.json());
    }

    logout(): Observable<any> {
        this.log.info(this.logoutUrl)

        return this.http.get(this.logoutUrl)
            .map(res => res.json());
    }

    getStockSummaryDetail(symbol: String) {
        this.log.info(this.detailSummaryUrl + symbol)

        return this.http.get(this.detailSummaryUrl + symbol)
            .map(res => res.json());
    }
}
