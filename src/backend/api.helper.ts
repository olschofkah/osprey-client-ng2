
import { ExpressRouteResponseResultHandler } from './module/responsehandler/express-route-response-result-handler';
import { DefaultResponseHandler } from './module/responsehandler/default-response-handler';
import { OspreyRepository } from './module/postgres/osprey.repository';
import { Request, Response} from 'express';
import * as winston from 'winston';
import * as config from 'config';

export const _db: OspreyRepository = new OspreyRepository();

export function getHotList(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findMostRecentHotlist(responseHandler);
}

export function getHotListForDate(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findHotlistForDate(req.params.date, responseHandler);
}

export function getBlackList(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findBlackList(responseHandler);
}

export function persistBlackList(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.persistBlackList(JSON.stringify(req.body), responseHandler);
}

export function getSecurityComments(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findSecurityComments(responseHandler);
}

export function getSecurityCommentsForSymbol(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findSecurityCommentsForSymbol(req.params.symbol, responseHandler);
}

export function persistSecurityComment(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.persistSecurityComment(req.body.symbol, req.body.comment, responseHandler);
}

export function deleteSecurityComment(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.deleteSecurityComment(req.body.id, responseHandler);
}

export function deleteHotListForSymbolAndDate(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.deleteHotlistItemForSymbolAndDate(req.body.key.symbol, req.body.reportDate, responseHandler);
}

export function getDetailSummary(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findDetailSummary(req.params.symbol, responseHandler);
}

export function getModelScreens(req: Request, res: Response) {
  let responseHandler = new ExpressRouteResponseResultHandler(res);
  _db.findModelScreens(responseHandler);
}

export function persistModelScreens(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.persistModelScreens(JSON.stringify(req.body), responseHandler);
}

export function insertHotListItem(req: Request, res: Response) {
  let responseHandler = new DefaultResponseHandler(res);
  _db.persistHotListItem(req.body, responseHandler);
}


export function ensureAuthenticated(req: Request, res: Response, next): any {

  winston.debug("Authorizing request for " + req.path + " ... Request Auth Status: " + req.isAuthenticated() + " sessionID:" + req.sessionID);

  if (req.isAuthenticated() && authorize(req)) {
    return next();
  } else {
    winston.warn('Login required for ' + req.path);
    res.redirect('/login');
  }
}

let allowedUserIds: string[] = config.get<string[]>('allowedUserIds');

function authorize(req: any): boolean {

  if (req.session.passport) {
    for (let i = 0; i < allowedUserIds.length; ++i) {
      if (allowedUserIds[i] === req.session.passport.user.id) {
        console.log("Allowing access for " + allowedUserIds[i] + " to " + req.path + " ... Request Auth Status: " + req.isAuthenticated() + " sessionID:" + req.sessionID);
        return true;
      }
    }
    console.log("Rejecting web authorization for " + req.sessionID + " | " + req.session.passport.user.id);
  }
  return false;
}
