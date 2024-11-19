const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes');
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connected to DB");
})
.catch(console.error);

app.use(express.json())
app.use(routes);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});


app.use((req, res, next) => {
  req.user = {
    _id: '672e74052a3f1f6bdb37cac2'// paste the _id of the test user created in the previous step
  };
  next();
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);// _id will become accessible
};
