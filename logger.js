const isDev = process.env.NODE_ENV === 'development';
const winston = require('winston');
const expressWinston = require('express-winston');

const consoleTransport = new (winston.transports.Console)({
  json: false,
  colorize: isDev,
  level: isDev ? 'debug' : 'info',
  handleExceptions: true,
  humanReadableUnhandledException: true
});
  
winston.configure({ transports: [consoleTransport], exitOnError: false });

const requestFilter = (req, propName) => {
  if (propName === 'headers') delete req.headers.cookie;
  return req[propName];
};

const dynamicMeta = (req, res) => req.user && req.user.userId ? [{ user: req.user.username}] : [];
const skip = (req, res) => req.headers && req.headers['user-agent'] && req.headers['user-agent'].includes('GoogleStackdriverMonitoring-UptimeChecks');

const requestLogger = expressWinston.logger({
  transports: [consoleTransport],
  expressFormat: true,
  meta: true,
  requestFilter,
  dynamicMeta,
  skip
});

module.exports = {
  requestLogger,
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  log: winston.log,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly
};