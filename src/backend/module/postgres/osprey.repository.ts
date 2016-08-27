
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
            text: `select array_to_json(array_agg(payload)) as payload
              from tha_hot_shit hot
              where not exists (select 1 from tha_hot_shit_ignore hoti where hoti.symbol = hot.symbol and hoti.date = hot.date )
              and ( hot.date = (select max(date) from tha_hot_shit) or hot.date = '19700101' );`,
            params: []
        };
        return this.execute(query, rh);
    }

    public findHotlistForDate(date: Date, rh: PostgresResultHandler) {
        winston.info("Fetching latest hot shit for today ... ");

        let query = {
            text: `select array_to_json(array_agg(payload)) as payload
              from tha_hot_shit hot
              where not exists (select 1 from tha_hot_shit_ignore hoti where hoti.symbol = hot.symbol and hoti.date = hot.date )
              and hot.date = $1;`,
            params: [date]
        };
        return this.execute(query, rh);
    }

    public deleteHotlistItemForSymbolAndDate(symbol: string, date: Date, rh: PostgresResultHandler) {
        winston.debug("deleting hotlist for symbol " + symbol + " and date " + date);

        let query = {
            text: `insert into tha_hot_shit_ignore
            (symbol, date, timestamp, deleted)
            values ($1, $2, clock_timestamp(), TRUE);`,
            params: [symbol, date]
        };
        return this.execute(query, rh);
    }

    public persistHotListItem(hotListItem: any, rh: PostgresResultHandler) {
        winston.debug("Inserting into hotlist for symbol " + hotListItem.key.symbol);

        let query = {
            text: `insert into tha_hot_shit values ($1, '19700101', clock_timestamp(), $2)`,
            params: [hotListItem.key.symbol, JSON.stringify(hotListItem)]
        };
        return this.execute(query, rh);
    }

    public findBlackList(rh: PostgresResultHandler) {
        winston.info("Fetching black list ... ");

        let query = {
            text: 'select obj_value as payload from oc_map where obj_key = \'black-list\';',
            params: []
        };
        return this.execute(query, rh);
    }

    public persistBlackList(blackList: any, rh: PostgresResultHandler) {
        winston.debug("Updating black list ... ");

        let query = {
            text: 'update oc_map set timestamp = clock_timestamp(), obj_value = $1 where obj_key = \'black-list\';',
            params: [blackList]
        };
        return this.execute(query, rh);
    }

    public findModelScreens(rh: PostgresResultHandler) {
        winston.debug("Fetching model screens ... ");

        let query = {
            text: 'select obj_value as payload from oc_map where obj_key = \'screens\';',
            params: []
        };
        return this.execute(query, rh);
    }

    public persistModelScreens(modelScreens: any, rh: PostgresResultHandler) {
        winston.debug("Updating model screens ... ");

        let query = {
            text: 'update oc_map set timestamp = clock_timestamp(), obj_value = $1 where obj_key = \'screens\';',
            params: [modelScreens]
        };
        return this.execute(query, rh);
    }

    public findSecurityComments(rh: PostgresResultHandler): void {
        winston.debug("Finding security comments ... ");

        let query = {
            text: `select array_to_json(array_agg(d)) as payload from
             (select id, symbol, timestamp, comment, user_id as userid from oc_security_comment where deleted = FALSE order by timestamp desc) d;
            `,
            params: []
        };
        return this.execute(query, rh);
    }

    public findSecurityCommentsForSymbol(symbol: string, rh: PostgresResultHandler): void {
        winston.debug("Finding security comments for " + symbol);

        let query = {
            text: `select array_to_json(array_agg(d)) as payload from
             (select id, symbol, timestamp, comment, user_id as userid from oc_security_comment where deleted = FALSE and symbol = $1 order by timestamp desc) d;`,
            params: [symbol]
        };
        return this.execute(query, rh);
    }

    public findChartDataForSymbol(symbol: string, rh: PostgresResultHandler): void {
        winston.debug("Finding chart data for " + symbol);

        let query = {
            text: `select array_to_json(array_agg(d)) as payload from (
                        select 	ohlc.symbol, 
                        ohlc.date,
                        ohlc.open,
                        ohlc.high,
                        ohlc.low,
                        ohlc.close,
                        ohlc.adj_close as adjclose,
                        ohlc.volume
                        from oc_security_ohlc_hist ohlc
                        where symbol = $1
                        order by date asc
                    ) d;`,
            params: [symbol]
        };
        return this.execute(query, rh);
    }

    public persistSecurityComment(symbol: string, comment: string, userId: any, rh: PostgresResultHandler) {
        winston.debug("Inserting security comments for " + symbol + " for user " + userId);

        let query = {
            text: `insert into oc_security_comment (symbol, timestamp, comment, user_id) values ($1, clock_timestamp(), $2, $3) `,
            params: [symbol, comment, userId]
        };
        return this.execute(query, rh);
    }

    public deleteSecurityComment(id: number, rh: PostgresResultHandler) {
        winston.debug("deleting security comment " + id);

        let query = {
            text: `update oc_security_comment 
            set deleted = TRUE, timestamp = clock_timestamp() 
            where id = $1`,
            params: [id]
        };
        return this.execute(query, rh);
    }

    public findDetailSummary(symbol: string, rh: PostgresResultHandler) {
        winston.info("Fetching summary detail for " + symbol);

        let query = {
            text: `select array_to_json(array_agg(d)) as payload from (
                        select 	f.symbol, 
                        s.company_name as companyname,
                        s.sector,
                        s.industry,
                        case when instrument_cd = 0 then 'Stock' when instrument_cd = 33 then 'ETF' else 'Other' end as instrumenttype, 
                        q.last as last, 
                        f.ebitda,
                        q.last - s.previous_close as dayschangedollar, 
                        case when s.previous_close = 0 then 0 else 1 - (s.previous_close / q.last) end as dayschangepct, 
                        q.volume,
                        f.market_cap as marketcap,
                        f.average_volume as averagevolume,
                        f.held_pct_insiders as pctinsiders,
                        f.held_pct_institutions as pctinst,
                        f.buy_info_shares - f.sell_info_shares as netinfoshares,
                        f.trailing_pe as trailingpe,
                        f.forward_pe as forwardpe,
                        f.div_yield as divyield,
                        f.volatility,
                        f.earnings_volatility as earningsvolatility,
                        f.earnings_avg_pct as earningsavgpct,
                        f._8_day_ema as _8dayema,
                        f._15_day_ema as _15dayema,
                        f._50_day_ema as _50dayema,
                        f._200_day_ema as _200dayema,
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
        return this.execute(query, rh);
    }

    private execute(query: any, rh: PostgresResultHandler) {

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
                        rh.handle(result.rows[0])
                    }
                });
            }
        });
    }

}
