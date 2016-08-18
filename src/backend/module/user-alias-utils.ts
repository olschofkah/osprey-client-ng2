

import * as config from 'config';

export class UserAliasUtils {

    private userMap: any = config.get<any>('userAliasMap');

    constructor() {

    }

    public mapIdToUser(userId: string): string {
        if (this.userMap[userId]) {
            return this.userMap[userId];
        } else {
            return userId;
        }
    }
}