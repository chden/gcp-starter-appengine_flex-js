'use strict';

const {createLogger, format, transports} = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');
const expressWinston = require('express-winston');
const path = require('path');

const packageJson = require('../../package.json');


const transportsInstances = [];
let level = 'info'; // default log level
if (process.env.APP_ENV === 'prod') {
  transportsInstances.push(new LoggingWinston({
    logName: packageJson.name ? `${packageJson.name}_log` : 'winston_log',
    labels: {
      version: packageJson.version || '',
    },
  }));
} else {
  level = 'debug'; // log all messages during development
  transportsInstances.push(new transports.Console());
}

// override the log level
if (process.env.APP_LOG_LEVEL) {
  level = process.env.APP_LOG_LEVEL;
}

const options = {
  level: level,
  transports: transportsInstances,
  format: format.combine(
    format.label({label: path.basename(process.mainModule.filename)}),
    format.timestamp(),
    format.printf(
      (info) => `${info.timestamp} ${info.level} [${info.label}]: ` +
        `${info.message}`,
    ),
  ),
};

const logger = createLogger(options);

const optionsHttp = {
  winstonInstance: logger, // if provided, transports and format are ignored
  level: 'debug', // log http requests with log level debug
  metaField: null, // store metadata at the root of the log entry
  responseField: null, // prevents the res from being included in the metadata
  requestWhitelist: ['headers', 'query'],
  responseWhitelist: ['body'], // populates res.body to get the response size
  dynamicMeta: (req, res) => {
    const httpRequest = {};
    const meta = {};
    if (req) {
      meta.httpRequest = httpRequest;
      httpRequest.requestMethod = req.method;
      httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      httpRequest.protocol = `HTTP/${req.httpVersion}`;
      httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ?
        req.ip.substring(req.ip.lastIndexOf(':') + 1) :
        req.ip; // just ipv4
      httpRequest.requestSize = req.socket.bytesRead;
      httpRequest.userAgent = req.get('User-Agent');
      httpRequest.referrer = req.get('Referrer');
    }

    if (res) {
      meta.httpRequest = httpRequest,
      httpRequest.status = res.statusCode,
      httpRequest.latency = {
        seconds: Math.floor(res.responseTime / 1000),
        nanos: (res.responseTime % 1000) * 1000000,
      };
      if (res.body) {
        if (typeof res.body === 'object') {
          httpRequest.responseSize = JSON.stringify(res.body).length;
        } else if (typeof res.body === 'string') {
          httpRequest.responseSize = res.body.length;
        }
      }
    }
    return meta;
  },
};

const loggerHttp = expressWinston.logger(optionsHttp);

const optionsError = {
  winstonInstance: logger, // if provided, transports and format are ignored
  msg: 'ERROR {{err.message}} {{res.statusCode}} {{req.method}}',
};

const loggerError = expressWinston.errorLogger(optionsError);

module.exports = {
  logger,
  loggerHttp,
  loggerError,
};
