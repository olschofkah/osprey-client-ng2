
import { PostgresResultHandler } from '../responsehandler/result-handler.interface'
import * as winston from 'winston';
import * as config from 'config';
import * as pg from 'pg';

/**
 * https://github.com/herculesinc/pg-io
 * 
 */
export class OspreyRepository {
    pool: any;

    constructor() {
        this.pool = new pg.Pool(config.get<any>('pg.config'));

        this.pool.on('error', function (err, client) {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            winston.error('idle client error', err.message, err.stack)
        })
    }

    public findMostRecentHotlist(rh: PostgresResultHandler) {
        winston.info("Fetching latest hot shit for today ... ");

        let query = {
            text: 'select array_to_json(array_agg(payload)) as aggpayload from tha_hot_shit where date = (select max(date) from tha_hot_shit);',
            params: []
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
                        where	q.symbol = $1
                        and q.symbol = f.symbol
                        and q.symbol = n.symbol
                        and q.symbol = s.symbol
                        and f.last_update_ts = (select max(f2.last_update_ts) from oc_security_fundamental f2 where f2.symbol = f.symbol)
                        and q.timestamp = (select max(q2.timestamp) from oc_security_quote q2 where q2.symbol = q.symbol)
                    ) d;`,
            params: [symbol]
        };
        return this.executeNoTx(query, rh);
    }

    private executeNoTx(query: any, rh: PostgresResultHandler) {

        this.pool.connect((err, client, done) => {
            if (err) {
                winston.error('error fetching client from pool', err);
            } else {
                client.query(query.text, query.params, (err, result) => {
                    //call `done()` to release the client back to the pool
                    done();

                    if (err) {
                        winston.error('error running query', err);
                    } else {
                        console.log(result);
                        rh.handle(result.rows[0])
                    }
                });
            }
        });
    }

}
