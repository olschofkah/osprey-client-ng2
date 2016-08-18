import * as winston from 'winston';
import * as config from 'config';
import * as https from 'https';
import { SlackMessage } from './slack-message'

export class SlackClient {
    private host: string = config.get<any>('slack.host');

    constructor() {

    }

    public postMessageToLiveTradeIdeas(user:string, msg: string) {

        let slackMsg: any = new SlackMessage(user, msg);
        winston.info('Slack Message: ', msg);

        let callback = function (response) {
            let str: string = 'Slack Response: ';
            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                winston.info(str);
            });
        }

        let httpRequest: any = https.request({
            method: 'POST',
            host: this.host,
            path: config.get<any>('slack.liveTradeIdeasWebHookPath')
        }, callback);

        httpRequest.write(JSON.stringify(slackMsg));
        httpRequest.on('error', (e) => {
            winston.error('Slack Error: ', e);
        })
        httpRequest.end();
    }

}