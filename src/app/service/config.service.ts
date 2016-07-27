import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Logger } from './logger.service'

@Injectable()
export class Config {
    private _config: any;
    private _env: any;

    constructor(private http: Http, private logger: Logger) {
        this.load();
    }

    load() {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/env.json')
                .map(res => res.json())
                .subscribe((env_data) => {
                    this._env = env_data;
                    this.logger.info('Config ENV: ', env_data);
                    this.http.get('/assets/' + env_data.env + '.json')
                        .map(res => res.json())
                        .catch((error: any) => {
                            console.error(error);
                            return Observable.throw(error.json().error || 'Server error');
                        })
                        .subscribe((data) => {
                            this._config = data;
                            this.logger.info('Config: ', data);
                            resolve(true);
                        });
                });
        });
    }
    getEnv():any {
        return this._env;
    }
    getAll(): any {
        return this._config;
    }
};