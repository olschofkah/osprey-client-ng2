import { Injectable } from '@angular/core';
import { HotListItem } from '../hotlistitem/hot-list-item'

import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HotListService {

    //private HOST: string = 'http://localhost:3000';
    private HOST: string =  'http://ec2-54-208-154-230.compute-1.amazonaws.com:3000' // TODO Extract to config

    private hotListUrl: string = this.HOST + '/api/hot-list';  // URL to web api

    constructor(private http: Http) { }

    getList(): Observable<any> {
        console.log(this.hotListUrl) // TODO use log service

        return this.http.get(this.hotListUrl)
            .map(res => res.json());
    }
}
