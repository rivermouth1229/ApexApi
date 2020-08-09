'use strict'

// HACK Keyはherokuの環境変数に入れる
const apiKey = '7ed80aab-4422-43fa-bace-231477edfdb0'
const baseUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile/psn/'
const user = 'rivermouth1229'

const fetch = require('node-fetch');

// Get data from Apex Api
// returns: promise
function GetStatusFromApexApi(baseUrl, user, isSession = false) {
  let sessionStr = isSession ? '/sessions' : ''
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${user}?TRN-Api-Key=${apiKey}${sessionStr}`)
      .then(response => {
        response.json()
          .then(data => resolve(data))
          .catch(e => reject(e))
      })
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
