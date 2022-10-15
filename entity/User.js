const mongoose = require('mongoose') 

const User = mongoose.model('User', {
    /*
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      }, 
      */
    email: String,
    password: String
})

module.exports = User