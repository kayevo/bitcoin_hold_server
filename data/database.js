const mongoose = require("mongoose");

function connectDadabase() {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", (error) => {
    console.error(error);
  });
  db.once("open", () => console.log("Database connected"));

  db.once("SIGUSR2", function () {
    db.kill(db.pid, "SIGUSR2");
  });

  db.on("SIGINT", function () {
    // this is only called on ctrl+c, not restart
    db.kill(db.pid, "SIGINT");
  });
}

module.exports = connectDadabase;
