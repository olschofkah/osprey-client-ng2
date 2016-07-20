import { Injectable } from '@angular/core';
import { HotListItem } from '../hotlistitem/hot-list-item'

import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HotListService {

    private hotListUrl = 'http://localhost:3000/api/hot-list';  // URL to web api

    constructor(private http: Http) { }

    getList(): Observable<any> {
        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }
}
