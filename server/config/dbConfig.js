const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

db.on("error", () => {
  console.log("Mongo Db Connection Failed");
});
