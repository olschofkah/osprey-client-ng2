// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import * as winston from 'winston';
import * as config from 'config';
import * as passport from 'passport';
import * as oauth from 'passport-google-oauth';
import * as session from 'express-session';
import * as randomstring from 'randomstring';
import * as connectPgSimple from 'connect-pg-simple';
import * as pg from 'pg'

import { enableProdMode } from '@angular/core';
import { expressEngine } from 'angular2-universal';


// enable prod for faster renders
enableProdMode();

winston.level = 'debug';
winston.add(winston.transports.File, { filename: config.get<string>('serverLogFile') });
winston.info('Logging levels set to ' + winston.level);

let allowedUserIds: string[] = config.get<string[]>('allowedUserIds');

const app = express();

// https://console.developers.google.com/apis/credentials?project=osprey-1383
passport.use(new oauth.OAuth2Strategy({
  clientID: config.get<string>('googleOAuthConfig.GOOGLE_CLIENT_ID'),
  clientSecret: config.get<string>('googleOAuthConfig.GOOGLE_CLIENT_SECRET'),
  callbackURL: config.get<string>('domain') + "/auth/google/callback" // TODO use window.location.origin ??? 

}, (accessToken, refreshToken, profile, cb) => {

  // Only allow specific IDs to continue; 
  if (profile) {
    for (let i = 0; i < allowedUserIds.length; ++i) {
      if (allowedUserIds[i] === profile.id) {
        winston.info('Successful Authentication', profile);
        return cb(null, profile);
      }
    }
  }
  winston.info('Failed Authentication Attempt', profile);
  cb(null, false, { message: 'invalid user' });
}));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete google profile is serialized
// and deserialized.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// TODO Combind winston & morgan logging
// winston.stream = {
//   write: (message, encoding) => {
//     winston.info(message);
//   }
// };

app.use(require("morgan")("combined"));
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pg: pg,                                         // Use global pg-module 
    conString: config.get<string>('pg.conString'),  // Connect using something else than default DATABASE_URL env variable 
    tableName: 'session'
  }),
  secret: randomstring.generate(),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1h
}));

// TODO USE LATER
// var sess = {
//   secret: 'keyboard cat',
//   cookie: {}
// }

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }

// app.use(session(sess))


const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('.html', expressEngine);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(cookieParser('Osprey'));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());


// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: 30 }));
app.use(express.static(path.join(ROOT, 'dist/client'), { index: false }));

import { persistModelScreens,
  getModelScreens,
  persistBlackList,
  getBlackList,
  getHotList,
  getDetailSummary,
  getSecurityComments,
  getSecurityCommentsForSymbol,
  persistSecurityComment,
  deleteSecurityComment,
  deleteHotListForSymbolAndDate,
  insertHotListItem,
  getHotListForDate,
  ensureAuthenticated
} from './backend/api.helper';

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/logout', (req, res) => {
  winston.info("Logging out ... Request Auth Status: " + req.isAuthenticated() + " sessionID:" + req.sessionID);
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error/403', scope: ['profile'] }),
  (req, res) => {
    res.redirect('/');
  });

// Osprey API Routes

app.get('/api/is-authenticated', (req, res) => {
  let b: boolean = req.isAuthenticated();
  winston.info("Authorizing request for " + req.path + " ... Request Auth Status: " + b + " sessionID:" + req.sessionID);
  res.send(b);
});

app.get('/api/hot-list', ensureAuthenticated, getHotList);
app.get('/api/detail-summary/:symbol', ensureAuthenticated, getDetailSummary);
app.get('/api/black-list', ensureAuthenticated, getBlackList);
app.get('/api/model-screens', ensureAuthenticated, getModelScreens);
app.get('/api/security-comments', ensureAuthenticated, getSecurityComments);
app.get('/api/security-comments/:symbol', ensureAuthenticated, getSecurityCommentsForSymbol);
app.get('/api/hot-list/:date', ensureAuthenticated, getHotListForDate);

app.post('/api/security-comments', ensureAuthenticated, persistSecurityComment);
app.post('/api/hot-list', ensureAuthenticated, insertHotListItem);

app.put('/api/black-list', ensureAuthenticated, persistBlackList);
app.put('/api/model-screens', ensureAuthenticated, persistModelScreens);
app.put('/api/security-comments', ensureAuthenticated, deleteSecurityComment);
app.put('/api/hot-list', ensureAuthenticated, deleteHotListForSymbolAndDate);

// END Osprey Api Routes

// import { ngApp } from './main.node';

let renderIndex = (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
}
// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/', renderIndex);
app.get('/home', renderIndex);
app.get('/login', renderIndex);
app.get('/hotlist', ensureAuthenticated, renderIndex);
app.get('/blacklist', ensureAuthenticated, renderIndex);
app.get('/modelscreens', ensureAuthenticated, renderIndex);
app.get('/notes', ensureAuthenticated, renderIndex);
app.get('/error/403', renderIndex);

// use indexFile over ngApp only when there is too much load on the server
function indexFile(req, res) {
  // when there is too much load on the server just send
  // the index.html without prerendering for client-only
  res.sendFile('/index.html', { root: __dirname });
}

app.get('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
app.listen(3000, () => {
  winston.info('Listening on: http://localhost:3000');
});


