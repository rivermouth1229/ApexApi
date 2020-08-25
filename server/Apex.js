'use strict'

// HACK Keyはherokuの環境変数に入れる
const baseUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile/psn/'
const user = process.env.ENV_APEX_API_USER
const apiKey = process.env.ENV_APEX_API_KEY

const fetch = require('node-fetch');

// Get data from Apex Api
// returns: promise
function GetStatusFromApexApi(baseUrl, user, isSession = false) {
  let sessionStr = isSession ? '/sessions' : ''
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${user}?TRN-Api-Key=${apiKey}${sessionStr}`)
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



exports.getStatus = (user) => {
  return GetStatusFromApexApi(baseUrl, user)
}

exports.adjust = (data) => {
  return AdjustStatusData(data)
}

exports.getMatch = (user) => {
  return GetStatusFromApexApi(baseUrl, user, true)
}
