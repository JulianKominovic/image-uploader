const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;
//connect to mongodb
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successful");
  })
  .catch((e) => console.error(e));
