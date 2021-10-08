'use strict';

const express = require('express');
const {logger, loggerHttp, loggerError} = require('./utils/logger');
const cors = require('cors');

const app = express();
const router = new express.Router();

app.use(loggerHttp);
app.use(cors());


const {hello, helloUser} = require('./hello/hello');
router.get('/', hello);
router.get('/:username', helloUser);

const {liveness, readiness} = require('./utils/health');
router.get('/check/liveness', liveness);
router.get('/check/readiness', readiness);


app.use('/', router);
app.use(loggerError);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}...`);
});

module.exports = app;
