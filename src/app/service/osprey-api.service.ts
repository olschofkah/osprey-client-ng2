import { HotListItem } from '../hotlistitem/hot-list-item'
import { BlackListSymbol } from '../blacklist/black-list-symbol'
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
    private blackListUrl: string;
    private modelScreensUrl: string;

    constructor(private http: Http, private log: Logger, private _config: Config) {

        this.domain = window.location.origin;
        this.isAuthenticatedUrl = this.domain + '/api/is-authenticated';
        this.hotListUrl = this.domain + '/api/hot-list';
        this.blackListUrl = this.domain + '/api/black-list';
        this.modelScreensUrl = this.domain + '/api/model-screens';
        this.detailSummaryUrl = this.domain + '/api/detail-summary/';

        this.logoutUrl = this.domain + '/auth/logout';

    }

    getHotList(): Observable<any> {
        this.log.info(this.hotListUrl);

        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }

    getBlackList(): Observable<any> {
        this.log.info(this.blackListUrl);

        return this.http.get(this.blackListUrl)
            .map(res => res.json());
    }

    persistBlackList(list: BlackListSymbol[]): Promise<any> {
        this.log.info(this.blackListUrl);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this.blackListUrl, list, { headers: headers })
            .toPromise();
    }

    getModelScreens(): Observable<any> {
        this.log.info(this.modelScreensUrl);

        return this.http.get(this.modelScreensUrl)
            .map(res => res.json());
    }

    persistModelScreens(modelScreens: any): any {
        this.log.info(this.modelScreensUrl);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this.modelScreensUrl, modelScreens, { headers: headers })
            .toPromise();
    }

    isAuthenticated(): Observable<boolean> {
        this.log.info(this.isAuthenticatedUrl);

        return this.http.get(this.isAuthenticatedUrl)
            .map(res => res.json());
    }

    logout(): Observable<any> {
        this.log.info(this.logoutUrl);

        return this.http.get(this.logoutUrl)
            .map(res => res.json());
    }

    getStockSummaryDetail(symbol: String) {
        this.log.info(this.detailSummaryUrl + symbol);

        return this.http.get(this.detailSummaryUrl + symbol)
            .map(res => res.json());
    }
}
