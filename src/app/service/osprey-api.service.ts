import { HotListItem } from '../hotlistitem/hot-list-item';
import { BlackListSymbol } from '../blacklist/black-list-symbol';
import { SecurityComment } from '../securitycomment/security-comment';
import { Logger } from '../service/logger.service';
import { Config } from '../service/config.service';

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
    private securityCommentsUrl: string;
    private chartDataUrl: string;

    constructor(private http: Http, private log: Logger, private _config: Config) {

        this.domain = window.location.origin;
        this.isAuthenticatedUrl = this.domain + '/api/is-authenticated';
        this.hotListUrl = this.domain + '/api/hot-list';
        this.blackListUrl = this.domain + '/api/black-list';
        this.modelScreensUrl = this.domain + '/api/model-screens';
        this.detailSummaryUrl = this.domain + '/api/detail-summary';
        this.securityCommentsUrl = this.domain + '/api/security-comments';
        this.chartDataUrl = this.domain + '/api/chart-data';

        this.logoutUrl = this.domain + '/auth/logout';

    }

    getHotList(): Observable<any> {
        this.log.info(this.hotListUrl);

        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }

    getHotListForDate(date: string): Observable<any> {
        let url: string = this.hotListUrl + "/" + date;
        this.log.info(url);

        return this.http.get(url)
            .map(res => res.json());
    }

    deleteHotListItem(item: HotListItem): Promise<any> {
        this.log.info(this.hotListUrl);

        return this.http
            .put(this.hotListUrl, item, { headers: this.generateHeadersForPutOrPost() })
            .toPromise();
    }

    insertHotListItem(item: HotListItem): Promise<any> {
        this.log.info(this.hotListUrl);

        return this.http
            .post(this.hotListUrl, item, { headers: this.generateHeadersForPutOrPost() })
            .toPromise();
    }

    getBlackList(): Observable<any> {
        this.log.info(this.blackListUrl);

        return this.http.get(this.blackListUrl)
            .map(res => res.json());
    }

    persistBlackList(list: BlackListSymbol[]): Promise<any> {
        this.log.info(this.blackListUrl);

        return this.http
            .put(this.blackListUrl, list, { headers: this.generateHeadersForPutOrPost() })
            .toPromise();
    }

    getModelScreens(): Observable<any> {
        this.log.info(this.modelScreensUrl);

        return this.http.get(this.modelScreensUrl)
            .map(res => res.json());
    }

    persistModelScreens(modelScreens: any): any {
        this.log.info(this.modelScreensUrl);

        return this.http
            .put(this.modelScreensUrl, modelScreens, { headers: this.generateHeadersForPutOrPost() })
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

    getStockSummaryDetail(symbol: String): Observable<any> {
        let url: string = this.detailSummaryUrl + "/" + symbol;
        this.log.info(url);

        return this.http.get(url)
            .map(res => res.json());
    }

    getSecurityCommentsForSymbol(symbol: String): Observable<any> {
        let url: string = this.securityCommentsUrl + "/" + symbol;
        this.log.info(url);

        return this.http.get(url)
            .map(res => res.json());
    }

    getSecurityComments(): Observable<any> {
        this.log.info(this.securityCommentsUrl);

        return this.http.get(this.securityCommentsUrl)
            .map(res => res.json());
    }

    getChartData(symbol:string): Observable<any> {
        let url: string = this.chartDataUrl + "/" + symbol;
        this.log.info(url);

        return this.http.get(url)
            .map(res => res.json());
    }

    insertSecurityComment(comment: SecurityComment): Promise<any> {
        this.log.info(this.securityCommentsUrl);

        return this.http
            .post(this.securityCommentsUrl, comment, { headers: this.generateHeadersForPutOrPost() })
            .toPromise();
    }

    deleteSecurityComment(comment: SecurityComment): Promise<any> {
        this.log.info(this.securityCommentsUrl);

        return this.http
            .put(this.securityCommentsUrl, comment, { headers: this.generateHeadersForPutOrPost() })
            .toPromise();
    }

    private generateHeadersForPutOrPost(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }
}
