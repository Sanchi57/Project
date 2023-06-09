const express = require("express");
const { default: mongoose } = require("mongoose");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
//mongoose.set(`strictQuery`,false);
mongoose.set(`strictQuery`,true);


//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute")


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
//Middleware for Errors
app.use(errorMiddleware);


module.exports = app;