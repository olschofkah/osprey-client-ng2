import { Response } from 'express';

export class ExpressRouteResponseResultHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        this.res.send(results.aggpayload);
    }
}