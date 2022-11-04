const mongoose = require("mongoose");

const AdsEntity = mongoose.model("Ads", {
  title: {
    type: String,
    required: true,
    index: true, // index field
  },
  posterUrl: {
    type: String,
    required: true,
  },
  webLink: {
    type: String,
    required: true,
  },
});

module.exports = AdsEntity;
