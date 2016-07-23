
import * as pg from 'pg-io';
import { PostgresResultHandler } from './result-handler.interface'
import * as winston from 'winston';

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
export class OspreyRepository {

    public findMostRecentHotlist(rh: PostgresResultHandler) {
        winston.info("Fetching latest hot shit for today ... ");

        let query = {
            text: 'select array_to_json(array_agg(payload)) as aggpayload from tha_hot_shit where date = (select max(date) from tha_hot_shit);',
            mask: 'object'
        };
        return this.executeNoTx(query, rh);
    }

    public findDetailSummary(symbol: string, rh: PostgresResultHandler) {
        winston.info("Fetching summary detail for " + symbol);

        let query = {
            text: `select array_to_json(array_agg(d)) as aggpayload from (
                        select 	f.symbol, 
                        s.company_name as companyname,
                        q.last as last, 
                        f.ebitda,
                        q.last - s.previous_close as dayschangedollar, 
                        case when s.previous_close = 0 then 0 else 1 - (s.previous_close / q.last) end as dayschangepct, 
                        q.volume,
                        f.market_cap as marketcap,
                        f.average_volume as averagevolume,
                        f.held_pct_insiders as pctinsiders,
                        f.held_pct_institutions as pctinst,
                        f.short_percent_of_float as pctshortfloat,
                        f.trailing_pe as trailingpe,
                        f.forward_pe as forwardpe,
                        f.div_yield as divyield,
                        n.next_ex_div_date as nextexdate,
                        n.next_earnings_date_est_low earningslowdate,
                        n.next_earnings_date_est_high earningshighdate
                        from	oc_security_quote q, oc_security_fundamental f, oc_security_next_events n, oc_security s
                        where	q.symbol = {{symbolInput}}
                        and q.symbol = f.symbol
                        and q.symbol = n.symbol
                        and q.symbol = s.symbol
                        and f.last_update_ts = (select max(f2.last_update_ts) from oc_security_fundamental f2 where f2.symbol = f.symbol)
                        and q.timestamp = (select max(q2.timestamp) from oc_security_quote q2 where q2.symbol = q.symbol)
                    ) d;`,
            mask: 'object',
            params: {
                symbolInput: symbol
            },
        };
        return this.executeNoTx(query, rh);
    }

    private executeNoTx(query: any, rh: PostgresResultHandler) {

        pgsql.db(settings).connect().then((connection) => {
            return connection.execute(query)
                .then((results) => {
                    winston.debug("db execution complete for: " + JSON.stringify(query));
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
