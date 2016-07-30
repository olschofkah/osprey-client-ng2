import { Injectable } from '@angular/core';
import { Logger } from './logger.service'

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject'; // TODO look at subjects more ... 


@Injectable()
export class ClientAlertService {
    // private msg: Subject<string>;
    public msg: string;
    public errorMsg: string;

    constructor(private log: Logger) {

    }

    public alertMsg(incomingMsg: string) {
        // this.msg
        //     .asObservable()
        //     .debounceTime(300)        // wait for 300ms pause in events
        //     .distinctUntilChanged()   // ignore if next search term is same as previous
        //     .switchMap(term => term   // switch to new observable each time
        //         // return the http search observable
        //         ? this.heroSearchService.search(term)
        //         // or the observable of empty heroes if no search term
        //         : Observable.of<Hero[]>([]))
        //     .catch(error => {
        //         // Todo: real error handling
        //         console.log(error);
        //         return Observable.of<Hero[]>([]);
        //     });

        this.msg = incomingMsg;
        this.log.info(incomingMsg);

        new Promise<any>(resolve =>
            setTimeout(() => {
                this.msg = null;
            }, 3000) // 3 seconds
        );

    }

    public alertError(incomingMsg: string) {
        this.errorMsg = incomingMsg;
        this.log.error(incomingMsg);

        new Promise<any>(resolve =>
            setTimeout(() => {
                this.errorMsg = null;
            }, 5000) // 5 seconds
        );

    }
}