'use strict'

const baseUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile/psn/'
const user = process.env.ENV_APEX_API_USER
const apiKey = process.env.ENV_APEX_API_KEY

const fetch = require('node-fetch')

// Get data from Apex Api
// returns: promise
function GetStatusFromApexApi(baseUrl, user) {
  return new Promise((resolve, reject) => {
    let apiUrl = `${baseUrl}${user}?TRN-Api-Key=${apiKey}`
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(e => {
        console.error(e)
        reject(e)
      })
  })
}

// Adjust api data to more usable data
function AdjustStatusData(apiData) {
  let data = apiData.data

  if (typeof data === 'undefined') {
    return null
  }

  let ret = {}

  ret.psnId        = data.platformInfo.platformUserId
  ret.rankValue    = data.segments[0].stats.rankScore.value
  ret.rankIconPath = data.segments[0].stats.rankScore.metadata.iconUrl

  let activeLegend = data.metadata.activeLegendName
  let query = data.segments.filter(x => x.metadata.name == activeLegend)
  if (query.length === 1) {
    ret.legendImagePath = query[0].metadata.imageUrl
    ret.backgroundPath  = query[0].metadata.bgImageUrl
  }

  return ret;
}

// シーズン事の期間
exports.seasons = [
  { id: 1, seasonStart: 20200801, seasonEnd: 20200816 },
  { id: 2, seasonStart: 20200817, seasonEnd: 20200928 },
  { id: 3, seasonStart: 20200929, seasonEnd: 20201010 },
]

// 現在のシーズン
exports.currentSeason = 2

exports.getStatus = (user) => {
  return GetStatusFromApexApi(baseUrl, user)
}

exports.adjust = (data) => {
  return AdjustStatusData(data)
}
