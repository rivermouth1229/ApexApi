'use strict'

// ======================================
// controller

var apex = require('./Apex.js');
var dal = require('./DAL.js');

var Controller = function() {}

Controller.prototype = {
  getApexStatus: (psnId, res) => {
    apex.getStatus(psnId)
      .then(data => {
        // 使いやすいようにデータを整形
        let adjustedData = apex.adjust(data)
        // データベースにデータを保存
        dal.saveUserStatus(adjustedData)
        // Httpメソッドのレスポンス
        res.json(adjustedData)
      })
      .catch(e => {
        console.error(e)
        res.send({})
      })
  },

  getRankScoreHistory: (psnId, res) => {
    dal.getRankScoreHistory(psnId)
    .then(data => res.json(data))
    .catch(e => {
      console.error(e)
      res.send({})
    })
  },
}

exports.controller = new Controller()
