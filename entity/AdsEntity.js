const mongoose = require('mongoose') 

const AdsEntity = mongoose.model('Ads', {
    title: String,
    posterUrl: String,
    webLink: String
})

module.exports = AdsEntity