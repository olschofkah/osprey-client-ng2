
import { ExpressRouteResponseResultHandler } from './module/responsehandler/express-route-response-result-handler';
import { OspreyRepository } from './module/postgres/osprey.repository';
import { Request, Response} from 'express';
import * as winston from 'winston';
import * as config from 'config';

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

export function ensureAuthenticated(req: Request, res: Response, next): any {

  console.log("Authorizing request for " + req.path + " ... Request Auth Status: " + req.isAuthenticated() + " sessionID:" + req.sessionID);

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
