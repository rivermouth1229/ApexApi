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
        //saveApexStatus(adjustedData)
        // Httpメソッドのレスポンス
        res.json(adjustedData)
      })
      .catch(e => {
        console.error(e)
        res.send({})
      })
  },


  saveApexStatus: (data) => {
    dal.saveUserStatus(data)
  },
}

exports.controller = new Controller()
