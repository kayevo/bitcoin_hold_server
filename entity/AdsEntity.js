const mongoose = require("mongoose");

const AdsEntity = mongoose.model("Ads", {
  title: {
    type: String,
    required: true,
    index: true, // index field
  },
  posterUrl: String,
  webLink: String,
});

module.exports = AdsEntity;
