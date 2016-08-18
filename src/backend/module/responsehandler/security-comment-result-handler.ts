import { Response } from 'express';
import { UserAliasUtils } from '../user-alias-utils'

export class SecurityCommentResultHandler {
    constructor(private res: Response) { }
    public handle(results: any) {
        if (results) {
            if (!results.payload) {
                this.res.send(JSON.stringify(null));
            } else {
                let userAlias: UserAliasUtils = new UserAliasUtils();

                for (let i = 0; i < results.payload.length; i++) {
                    results.payload[i].username = userAlias.mapIdToUser(results.payload[i].userid);
                }
                this.res.send(results.payload);
            }
        } else {
            // error?
            this.res.sendStatus(404);
        }
    }
}