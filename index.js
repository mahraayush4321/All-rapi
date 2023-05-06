const express = require("express");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/ALL");

const userRoutes = require("./routes/userRoute");

//store routes
const storeRoute = require("./routes/storeRoute");

app.use("/api", userRoutes);

//store routes
app.use("/api", storeRoute);

//catergory routes

const categoryRoute = require("./routes/categoryRoute");

app.use("/api", categoryRoute);

app.listen(3000, () => {
  console.log("server started running");
});
