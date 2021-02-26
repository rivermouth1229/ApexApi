"use strict";

require("dotenv").config();
const fetch = require("node-fetch");

exports.ApexStatus = class ApexStatus {
  static async fetchStatus(psnId) {
    if (process.env.ENV_APEX_API_KEY) {
      const baseUrl =
        "https://public-api.tracker.gg/v2/apex/standard/profile/psn/";
      const apiKey = process.env.ENV_APEX_API_KEY;
      let apiUrl = `${baseUrl}${psnId}?TRN-Api-Key=${apiKey}`;
      const response = await fetch(apiUrl);
      const { data } = await response.json();
      let ret = {};
      ret.psnId = data.platformInfo.platformUserId;
      ret.rankValue = data.segments[0].stats.rankScore.value;
      ret.rankIconPath = data.segments[0].stats.rankScore.metadata.iconUrl;
      let activeLegend = data.metadata.activeLegendName;
      let query = data.segments.filter((x) => x.metadata.name == activeLegend);
      if (query.length === 1) {
        ret.legendImagePath = query[0].metadata.imageUrl;
        ret.backgroundPath = query[0].metadata.bgImageUrl;
      }
      return ret;
    } else {
      // それっぽい値のjsonを返す
      return new Promise((resolve) => setTimeout(() => resolve(), 500)).then(
        () => {
          return {
            psnId: psnId,
            rankValue: Math.floor(Math.random() * 9999),
            rankIconPath:
              "https://trackercdn.com/cdn/apex.tracker.gg/ranks/gold1.png",
            legendImagePath:
              "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-tile.png",
            backgroundPath:
              "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-concept-bg-small.jpg",
          };
        }
      );
    }
  }
};
