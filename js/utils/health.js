'use strict';

exports.liveness = (req, res) => {
  res.status(200).send();
};

exports.readiness = (req, res) => {
  res.status(200).send();
};
