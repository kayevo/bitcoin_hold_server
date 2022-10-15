const mongoose = require('mongoose')

function connectDadabase(){
    mongoose.connect(
        "",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
      
      const db = mongoose.connection
      db.on("error", (error) => {console.error(error)})
      db.once("open", () => console.log("Connected to the databse."))
}

module.exports = connectDadabase