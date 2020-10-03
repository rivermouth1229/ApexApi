'use strict'

var apex = require('./Apex.js')
require('date-utils')

require('dotenv').config();
var { Pool } = require('pg')
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// データベースにユーザ情報を保存する関数
// 今はランクスコアのみ
function SaveUserStatus(data, backDate) {
  if (data === null) {
    return
  }

  let psnId = data.psnId
  console.log(`Save user data. psnId:${psnId}`)

  ;( async () => {
    let client = await pool.connect()

    // =================================
    // ユーザIDの取得
    let userId = -1
    let user = await client.query('SELECT id FROM users WHERE psnid=$1', [psnId])
    if (user.rows.length === 1) {
      // psnIdが登録済みならユーザ番号を取得
      userId = user.rows[0].id
    }
    else {
      // 未登録ならデータベースに登録
      await client.query('INSERT INTO users (psnId) VALUES ($1)', [psnId])
      console.log('add new user ID:' + data.psnId)
    }

    // =================================
    // データの保存
    let today = new Date().toFormat("YYYYMMDD")
    //today.remove({days: backDate})

    // 一度今日日付のデータを取得し、あれば上書き、なければ追加する
    let result = await client.query('SELECT * FROM userdata WHERE userid=$1 AND date=$2', [userId, today])
    let upsertQuery = (result.rows.length === 1) ?
      'UPDATE userdata SET rankscore=$3 WHERE userid=$1 AND date=$2' :
      'INSERT INTO userdata VALUES ($1, $2, $3)'

    await client.query(upsertQuery, [userId, today, data.rankValue])
    console.log('Upsert user data.')
  })()
  .catch(e => console.log(e))
}

// ランクスコアの履歴データを取得する
// HACK SQLを一つにしたい
async function GetRankHistory(psnId, scoreFromApi, season) {
  let client = await pool.connect()

  // =================================
  // ユーザIDの取得
  let userId = -1
  let user = await client.query('SELECT id FROM users WHERE psnid=$1', [psnId])
  if (user.rows.length === 1) {
    userId = user.rows[0].id
  }

  // =================================
  // season
  let seasonData = GetTargetSeasonData(season)

  // =================================
  // データの取得
  let result = await client.query(
    'SELECT * FROM userdata WHERE userid=$1 AND date BETWEEN $2 AND $3',
    [userId, seasonData.start, seasonData.end]
  )

  // =================================
  // 今日のデータはAPIから取得した値にする
  if (seasonData.target === apex.currentSeason) {
    AddTodaysData(result.rows, scoreFromApi)
  }

  return result.rows
}

// 全ユーザのPSN IDを取得する関数
async function GetAllUsers() {
  let client = await pool.connect()
  let users = await client.query('SELECT psnid FROM users')
  return users.rows
}

// 履歴データに今日のデータを追加/更新する関数
function AddTodaysData(destination, mergeData) {
  let today = new Date().toFormat("YYYYMMDD")

  let todaysData = destination.filter(e => e.date === today)
  switch (todaysData.length) {
    case 0:
      destination.push({date: today, rankscore: mergeData})
      break;
    case 1:
      todaysData[0].rankscore = mergeData
      break;
    default:
      console.log('Why there are multiple data!?')
      break;
  }
}

function GetTargetSeasonData(season) {
  let ret = {}
  let targetSeason = (season != null) ? season : apex.currentSeason
  let seasonData = apex.seasons.find(x => x.id == targetSeason)
  if (seasonData != null) {
    ret.target = targetSeason
    ret.start  = seasonData.seasonStart
    ret.end    = seasonData.seasonEnd
  }

  return ret
}

exports.saveUserStatus = (data, backDate) => {
  SaveUserStatus(data, backDate)
}

exports.getRankScoreHistory = (psnId, scoreFromApi, season) => {
  return GetRankHistory(psnId, scoreFromApi, season)
}

exports.getAllUsers = () => {
  return GetAllUsers()
}

exports.getSeasonData = (season) => {
  return GetTargetSeasonData(season)
}
