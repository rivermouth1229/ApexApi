'use strict'

var apex = require('./server/Apex.js')
var methods = require('./server/HttpMethods.js')
var express = require('express')
var app = express()
var cors = require('cors')
var path = require('path')



// Get View
app.use(express.static(path.join(__dirname, 'html')))

// Get Apex Status Json Data
app.get('/GetStatus', cors(), (req, res) => {
  let psnId = req.query['id']
  methods.controller.getApexStatus(psnId, res)
})



// Start listning
app.listen(process.env.PORT || 3000, function () {
  console.log(`Start server listen. Port:${process.env.PORT || 3000}`)
})
