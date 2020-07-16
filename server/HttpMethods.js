'use strict'

// ======================================
// controller

var apex = require('./Apex.js');

var Controller = function() {}

Controller.prototype = {
  getApexStatus: (psnId, res) => {
    apex.getStatus(psnId)
      .then(data => res.json(data))
      .catch(e => {
        console.error(e)
        res.send({})
      })
  },
}

exports.controller = new Controller()
