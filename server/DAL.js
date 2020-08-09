'use strict'

require('date-utils')

require('dotenv').config();
var { Pool } = require('pg')
var pool = new Pool({
  //host: process.env.ENV_HOST,
  //databese: process.env.ENV_DB,
  //user: process.env.ENV_USER,
  //port: 5432,
  //password: process.env.ENV_PASS,

  connectionString: process.env.DATABASE_URL,
})

// データベースにユーザ情報を保存する関数
// 今はランクスコアのみ
function SaveUserStatus(data) {
  if (data === null) {
    return;
  }

  let psnId = data.psnId
  console.log(`psnid:${psnId}`)

  ;( async () => {
    console.log('before connect')
    let client = await pool.connect()

    // =================================
    // ユーザIDの取得
    console.log('before select')
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

    // 一度今日日付のデータを取得し、あれば上書き、なければ追加する
    let result = await client.query('SELECT * FROM userdata WHERE userid=$1 AND date=$2', [userId, today])
    let upsertQuery = result.rows.length === 1 ?
      'UPDATE userdata SET rankscore=$3 WHERE userid=$1 AND date=$2' :
      'INSERT INTO userdata VALUES ($1, $2, $3)'

    console.log('before upsert')
    await client.query(upsertQuery, [userId, today, data.rankValue])


    console.log('Upsert user data.')
  })()
  .catch(e => console.log(e))
}

// ランクスコアの履歴データを取得する
// HACK SQLを一つにしたい
async function GetRankHistory(psnId) {
  let client = await pool.connect()

  // =================================
  // ユーザIDの取得
  let userId = -1
  let user = await client.query('SELECT id FROM users WHERE psnid=$1', [psnId])
  if (user.rows.length === 1) {
    userId = user.rows[0].id
  }

  // =================================
  // データの取得
  let result = await client.query('SELECT * FROM userdata WHERE userid=$1', [userId])
  return result.rows
}



exports.saveUserStatus = (data) => {
  SaveUserStatus(data)
}

exports.getRankScoreHistory = (psnId) => {
  return GetRankHistory(psnId)
}

exports.test = () => {
  ;( async () => {
    console.log('test start')
    let client = await pool.connect()

    // =================================
    console.log('select user start')
    let user = await client.query('SELECT id FROM users WHERE psnid=$1', ['rivermouth1229'])
    if (user.rows.length === 1) {
      console.log(user.rows[0].id)
    }

    // =================================
    console.log('insert user start')
    let result = await client.query('INSERT INTO users (psnId) VALUES ($1))', ['rivermouth1229'])

  })
}



// createコマンド
/*
create table Users (id serial, psnId varchar(16), PRIMARY KEY (psnId));
create table UserData (userId integer, date varchar(10), rankScore integer);
*/
