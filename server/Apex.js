'use strict'

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


exports.getStatus = (user) => {
  return GetStatusFromApexApi(baseUrl, user)
}

exports.getMatch = (user) => {
  return GetStatusFromApexApi(baseUrl, user, true)
}
