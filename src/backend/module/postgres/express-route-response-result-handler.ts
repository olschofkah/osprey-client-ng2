import { Response } from 'express';

export class ExpressRouteResponseResultHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        console.log(results);
        this.res.send(results.aggpayload);
    }
}