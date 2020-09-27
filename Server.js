'use strict'

// express
var express = require('express')
var app = express()
var cors = require('cors')

// 自作モジュール
var apex = require('./server/Apex.js')
var dal = require('./server/DAL.js')


// Set static path for javascript node_modules
app.use('/scripts', express.static(__dirname + '/node_modules/'))

// Get View
app.use(express.static('html'))

// Get Apex Status Json Data
app.get('/GetStatus', cors(), (req, res) => {
  let psnId = req.query['id']
  console.log('GetStatus called. ID:' + psnId)

  apex.getStatus(psnId)
    .then(data => {
      // 使いやすいように整形
      let adjustedData = apex.adjust(data)

      // ステータス履歴の取得
      dal.getRankScoreHistory(psnId, adjustedData.rankValue)
        .then(historyData => {
          // レスポンスするデータに履歴データを追加
          adjustedData.historyData = historyData

          // Httpメソッドのレスポンス
          res.json(adjustedData)
        })
        .catch(e => {
          console.error(e)
          res.send({})
        })
    })
    .catch(e => {
      console.error(e)
      res.send({})
    })
})

// Get Apex Rank Score History
app.get('/GetHistory', cors(), (req, res) => {
  let psnId = req.query['id']
  console.log('GetHistory called. ID:' + psnId)

  dal.getRankScoreHistory(psnId)
    .then(data => res.json(data))
    .catch(e => {
      console.error(e)
      res.send({})
    })
})

// Save data of all users in db
app.get('/SaveAllUserData', (req, res) => {
  console.log('Call saveAllUserData')
  try {
    // 全ユーザを取得し、3秒インターバルでAPI取得とDBへの保存を行う
    dal.getAllUsers()
      .then(users => {
        users.forEach((user, index) => {
          setTimeout(() => {
            apex.getStatus(user.psnid)
              .then(data => dal.saveUserStatus(apex.adjust(data)))
              .catch(e => console.error(e))
          }, 3000 * index)
        })
      })
      .catch(e => console.error(e))

    // 保存は非同期で実行、レスポンスはさっさと返す
    res.send('success')
  }
  catch(e) {
    console.log(e)
    res.send('failed')
  }
})


// Start listning
app.listen(process.env.PORT || 3000, function () {
  console.log(`Start server listen. Port:${process.env.PORT || 3000}`)
})
