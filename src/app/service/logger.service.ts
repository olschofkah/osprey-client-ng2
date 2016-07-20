
import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

    public info(message: string, object?: any) {
        console.log(message);
        if (object) {
            console.log(object);
        }
    }

    public warn(message: string, object?: any) {
        console.warn(message);
        if (object) {
            console.warn(object);
        }
    }

    public error(message: string, object?: any) {
        console.error(message);
        if (object) {
            console.error(object);
        }
    }
}
