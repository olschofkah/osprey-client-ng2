
import * as pg from 'pg-io';
import { PostgresResultHandler } from './result-handler.interface'

const pgsql = pg;

let settings = {
    host: 'ospreydb.cl1fkmenjbzm.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: 'ospreynodeusr',
    password: '@7wTASPfJ&gh',
    database: 'osprey01',
    poolSize: 10
}

/**
 * https://github.com/herculesinc/pg-io
 * 
 */
export class HotListRepository {

    public findMostRecentHotlist(rh: PostgresResultHandler) {
        let query = {
            text: 'select array_to_json(array_agg(payload)) as aggpayload from tha_hot_shit where date = (select max(date) from tha_hot_shit);',
            mask: 'object'
        };
        return this.executeNoTx(query, rh);
    }

    private executeNoTx(query: any, rh: PostgresResultHandler) {

        pgsql.db(settings).connect().then((connection) => {
            return connection.execute(query)
                .then((results) => {
                    rh.handle(results);
                })
                .then(() => connection.release());
        });
    }

    private execute(query: any, rh: PostgresResultHandler) {
        return pgsql.db(settings).connect({ stratTransaction: true }).then((connection) => {

            // execute the query
            return connection.execute(query)
                .then((results) => {
                    rh.handle(results);
                })
                // release the connection back to the pool
                .then(() => connection.release('commit'));
        });
    }
}
