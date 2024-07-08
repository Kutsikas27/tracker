//@ts-nocheck

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomValue = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomValue}`;
};
const usernames = [];
app.post("/api/users", (req, res) => {
  const uniqueId = generateId();
  const { username } = req.body;
  if (username) {
    usernames.push({ username: req.body.username, _id: uniqueId });
    res.json({ username: req.body.username, _id: uniqueId });
  }
  console.log(usernames);
});
app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  console.log(req);

  const { username, description, duration, date, _id } = req.body;

  res.json({
    username: username,
    description: description,
    duration: duration,
    date: date,
    _id: _id,
  });
});

app.get("/api/users", (req, res) => {
  res.json(usernames);
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
