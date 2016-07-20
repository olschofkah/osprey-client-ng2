
import { ExpressRouteResponseResultHandler } from './module/postgres/express-route-response-result-handler';
import { HotListRepository } from './module/postgres/hot-list.repository';
import { Request, Response} from 'express';

// you would use cookies/token etc
// var USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

export const _db: HotListRepository= new HotListRepository();

export function getHotList(req: any, res: any) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findMostRecentHotlist(responseHandler);
}

