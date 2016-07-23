
import { ExpressRouteResponseResultHandler } from './module/postgres/express-route-response-result-handler';
import { OspreyRepository } from './module/postgres/osprey.repository';
import { Request, Response} from 'express';

// you would use cookies/token etc
// var USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

export const _db: OspreyRepository = new OspreyRepository();

export function getHotList(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findMostRecentHotlist(responseHandler);
}

export function getDetailSummary(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findDetailSummary(req.params.symbol, responseHandler);
}

