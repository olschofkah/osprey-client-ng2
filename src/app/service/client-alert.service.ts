import { Injectable } from '@angular/core';
import { Logger } from './logger.service'

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject'; // TODO look at subjects more ... 


@Injectable()
export class ClientAlertService {

    public msgs: string[] = [];
    public errorMsgs: string[] = [];

    constructor(private log: Logger) {

    }

    public alertMsg(incomingMsg: string, obj?: any) {

        let fMsg: string;
        if (obj) {
            fMsg = incomingMsg + JSON.stringify(obj);
            this.log.info(incomingMsg, obj);
        } else {
            fMsg = incomingMsg;
            this.log.info(incomingMsg);
        }

        this.msgs.push(fMsg);

        new Promise<any>(resolve =>
            setTimeout(() => {
                this.msgs.splice(0, 1);
            }, 3000) // 3 seconds
        );

    }

    public alertError(incomingMsg: string, obj?: any) {

        let fMsg: string;
        if (obj) {
            fMsg = incomingMsg + JSON.stringify(obj);
            this.log.error(incomingMsg, obj);
        } else {
            fMsg = incomingMsg;
            this.log.error(incomingMsg);
        }

        this.errorMsgs.push(fMsg);

        new Promise<any>(resolve =>
            setTimeout(() => {
                this.errorMsgs.splice(0, 1);
            }, 5000) // 5 seconds
        );

    }
}