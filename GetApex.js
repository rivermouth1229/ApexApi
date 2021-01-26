"use strict";

var apex = require("./server/Apex.js");
var methods = require("./server/HttpMethods.js");
var fs = require("fs");
var http = require("http");
var server = http.createServer();

apex.getStatus("rivermouth1229").then((ret) => {
  console.log(`show status of ${ret.data.platformInfo.platformUserId}`);

  let text = JSON.stringify(ret, null, "  ");
  fs.writeFile("myStatus.json", text, (err, data) => {
    if (err) console.log(err);
    else console.log("write end");
  });
});

apex.getStatus("rivermouth1229").then((ret) => {
  console.log(`show match of ${ret.data.platformInfo.platformUserId}`);

  let text = JSON.stringify(ret, null, "  ");
  fs.writeFile("myMatch.json", text, (err, data) => {
    if (err) console.log(err);
    else console.log("write end");
  });
});

return;
