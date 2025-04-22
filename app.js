const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate').errors;
const routes = require('./routes');
const mainRouter = require("./routes/index");
const { errorHandler } = require('./middlewares/error-handlers');
const { requestLogger, errorLogger  } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connected to DB");
})
.catch(console.error);

app.use(cors());

app.use(express.json())
app.use(requestLogger);
app.use(routes);

app.use(errorLogger); //enabling the error logger

app.use("/", mainRouter);
app.use(errors()); //celebrate error handler
app.use(errorHandler); //centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

