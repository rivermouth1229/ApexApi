"use strict";

// express
var express = require("express");
var app = express();
var cors = require("cors");
require("date-utils");

// 自作モジュール
var apex = require("./server/Apex.js");
var dal = require("./server/DAL.js");
const { ScoreLog } = require("./models/ScoreLog");
const { ApexStatus } = require("./models/ApexStatus");

// Set static path for javascript node_modules
app.use("/scripts", express.static(__dirname + "/../node_modules/"));

// Get View
app.use(express.static("app/html"));

// Get Apex Status Json Data
app.get("/GetStatus", cors(), async (req, res) => {
  let psnId = req.query.id;
  let season = req.query.season;
  console.log(`GetStatus called. ID: ${psnId}, Season: ${season}`);

  const apexStatus = await ApexStatus.fetchStatus(psnId);
  const today = new Date();
  const scoreLogToday = await ScoreLog.findFirst({
    where: {
      user: { psnId: psnId },
      date: today,
    },
  });
  if (scoreLogToday) {
    await ScoreLog.update({
      where: {
        id: scoreLogToday.id,
      },
      data: {
        rankScore: apexStatus.rankValue,
      },
    });
  } else {
    await ScoreLog.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              psnId: psnId,
            },
            create: {
              psnId: psnId,
            },
          },
        },
        date: today,
        rankScore: apexStatus.rankValue,
      },
    });
  }

  const seasonData = dal.getSeasonData(season);
  const historyData = await ScoreLog.findMany({
    select: {
      date: true,
      rankScore: true,
    },
    where: {
      user: { psnId: psnId },
      AND: [
        { date: { gte: new Date(seasonData.start) } },
        { date: { lte: new Date(seasonData.end) } },
      ],
    },
  });
  historyData.forEach((x) => {
    x.date = x.date.toFormat("YYYY-MM-DD");
  });
  const response = {};
  Object.assign(response, apexStatus);
  response.historyData = historyData;
  response.seasonData = seasonData;
  res.json(response);
});

// Get Apex Rank Score History
app.get("/GetHistory", cors(), async (req, res) => {
  let psnId = req.query.id;
  let season = req.query.season;
  let rank = req.query.rank;
  console.log(
    `GetHistory called. ID: ${psnId}, Season: ${season}, Rank: ${rank}`
  );

  const seasonData = dal.getSeasonData(season);
  const historyData = await ScoreLog.findMany({
    select: {
      date: true,
      rankScore: true,
    },
    where: {
      user: { psnId: psnId },
      AND: [
        { date: { gte: new Date(seasonData.start) } },
        { date: { lte: new Date(seasonData.end) } },
      ],
    },
  });
  const response = {};
  response.historyData = historyData;
  response.seasonData = seasonData;
  historyData.forEach((x) => {
    x.date = x.date.toFormat("YYYY-MM-DD");
  });
  res.json(response);
});

// Save data of all users in db
app.get("/SaveAllUserData", (req, res) => {
  let backDate = req.query.backDate != null ? Number(req.query.backDate) : 0;
  console.log(`Call saveAllUserData backDate: ${backDate}`);
  try {
    // 全ユーザを取得し、3秒インターバルでAPI取得とDBへの保存を行う
    dal
      .getAllUsers()
      .then((users) => {
        users.forEach((user, index) => {
          setTimeout(() => {
            apex
              .getStatus(user.psnid)
              .then((data) => dal.saveUserStatus(apex.adjust(data), backDate))
              .catch((e) => console.error(e));
          }, 3000 * index);
        });
      })
      .catch((e) => console.error(e));

    // 保存は非同期で実行、レスポンスはさっさと返す
    res.send("success");
  } catch (e) {
    console.log(e);
    res.send("failed");
  }
});

// Start listning
app.listen(process.env.PORT || 3000, function () {
  console.log(`Start server listen. Port:${process.env.PORT || 3000}`);
});
