const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const expressty = require('expressty');
const methodOverride = require('method-override');
const { requestLogger } = require('../logger');
const userService = require('./user-auth')({ cookieName: 'movieServiceSession', allowAnonymous: true });

module.exports = function init(app) {
  app.get('/_ah/health', (req, res) => res.sendStatus(200));
  app.use(requestLogger);
  app.set('x-powered-by', false);
  app.use(compression());
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(bodyParser.json({ strict: false, limit: '50mb' }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(expressty);
  app.use(userService);
};
