import { Response } from 'express';

export class ExpressRouteResponseResultHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        if (results) {
            this.res.send(results.payload);
        } else {
            // error?
            this.res.sendStatus(404);
        }
    }
}