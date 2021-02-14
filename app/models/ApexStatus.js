"use strict";

exports.ApexStatus = class ApexStatus {
  static async fetch(psnId) {
    if (process.env.NODE_ENV !== "production") {
      // それっぽい値のjsonを返す
      setTimeout(
        () => ({
          psnId: psnId,
          rankValue: Math.floor(Math.random() * 9999),
          rankIconPath:
            "https://trackercdn.com/cdn/apex.tracker.gg/ranks/gold1.png",
          legendImagePath:
            "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-tile.png",
          backgroundPath:
            "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-concept-bg-small.jpg",
        }),
        500
      );
    } else {
      // 未実装
      // APIからデータを取得して、整形したjsonを返す
      return {};
    }
  }
};
