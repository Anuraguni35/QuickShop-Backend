const express = require("express");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./routes/v1");
const { errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const { jwtStrategy } = require("./config/passport");
const helmet = require("helmet");
const passport = require("passport");
const mongoose = require("mongoose");

const config = require("./config/config");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(morgan("dev"));
// set security HTTP headers - https://helmetjs.github.io/
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// Initialize passport and add "jwt" authentication strategy
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// MongoDB connection
const mongoUri = 'mongodb+srv://anuraguniyal35:Power35@ac-4tqghtj.seei6yz.mongodb.net/qkart?authSource=admin&retryWrites=true&w=majority';

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
  })
  .then(() => {
    console.log("Connected to DB");
    app.listen(config.port, () => {
      console.log("Server connected successfully on port " + config.port);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB: ", err);
  });

// Reroute all API requests starting with "/v1" route
app.use("/",routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);

 