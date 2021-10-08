'use strict';

const {logger} = require('../utils/logger');


exports.hello = (req, res) => {
  logger.info('Log this info message!');
  logger.warn('Log this warn message!');
  res.send('Hello, World!');
};

exports.helloUser = (req, res) => {
  const username = req.params.username;
  res.send(`Hello, ${username}!`);
};
