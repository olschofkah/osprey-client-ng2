import { Response } from 'express';

export class DefaultResponseHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        this.res.send(results);
    }
}