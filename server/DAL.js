'use strict'

var { Client } = require('pg')
var client = new Client ({
  user: "kawaguchi",
  password: "",
  host: "localhost",
  port: "5432",
  database: "apexapidb"
})



// データベースにユーザ情報を保存する関数
// 今はランクスコアのみ
function SaveUserStatus(data) {
  console.log('lets connect to db!')

  client.connect()
  .then(() => console.log("Connected successfuly"))
  .then(() => client.query("select * from users"))
  .then(results => console.table(results.rows))
  .catch((e => console.log(e)))
  .finally((() => client.end()))
}



exports.saveUserStatus = (user) => {
  SaveUserStatus(data)
}
