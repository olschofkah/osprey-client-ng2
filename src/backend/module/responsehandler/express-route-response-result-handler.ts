import { Response } from 'express';

export class ExpressRouteResponseResultHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        if (results) {
            if (!results.payload) {
                this.res.send(JSON.stringify(null));
            } else {
                this.res.send(results.payload);
            }
        } else {
            // error?
            this.res.sendStatus(404);
        }
    }
}