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
  let psnId = req.query.id
  let season = req.query.season
  console.log(`GetStatus called. ID: ${psnId}, Season: ${season}`)

  apex.getStatus(psnId)
    .then(data => {
      // 使いやすいように整形
      let adjustedData = apex.adjust(data)

      // ステータス履歴の取得
      dal.getRankScoreHistory(psnId, adjustedData.rankValue, season)
        .then(historyData => {
          // レスポンスするデータに履歴データを追加
          adjustedData.historyData = historyData

          // シーズンに関するデータを付与
          adjustedData.seasonData = dal.getSeasonData(season)

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
  let psnId = req.query.id
  let season = req.query.season
  let rank = req.query.rank
  console.log(`GetHistory called. ID: ${psnId}, Season: ${season}, Rank: ${rank}`)

  dal.getRankScoreHistory(psnId, rank, season)
    .then(data => {
      let ret = {
        historyData: data,
        seasonData: dal.getSeasonData(season),
      }

      res.json(ret)
    })
    .catch(e => {
      console.error(e)
      res.send({})
    })
})

// Save data of all users in db
app.get('/SaveAllUserData', (req, res) => {
  let backDate = req.query.backDate != null ? Number(req.query.backDate) : 0
  console.log(`Call saveAllUserData backDate: ${backDate}`)
  try {
    // 全ユーザを取得し、3秒インターバルでAPI取得とDBへの保存を行う
    dal.getAllUsers()
      .then(users => {
        users.forEach((user, index) => {
          setTimeout(() => {
            apex.getStatus(user.psnid)
              .then(data => dal.saveUserStatus(apex.adjust(data), backDate))
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
