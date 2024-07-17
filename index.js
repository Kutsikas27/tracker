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
const users = [];
const logs = [];
function getUsernameById(id) {
  for (let user of users) {
    if (user._id === id) {
      return user.username;
    }
  }
  return console.log("no matching user");
}
const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomValue = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomValue}`;
};
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  console.log(dates);
  return dates;
}

function findSpecificDates(logs, startDate, endDate) {
  const allDates = getDatesBetween(startDate, endDate);
  const allDatesSet = new Set(allDates);

  return logs.filter((log) => allDatesSet.has(log.date));
}

app.post("/api/users", (req, res) => {
  const uniqueId = generateId();
  const { username } = req.body;
  if (username) {
    users.push({ username: req.body.username, _id: uniqueId });
    res.json({ username: req.body.username, _id: uniqueId });
  }
});
app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration } = req.body;
  let date = new Date();
  if (req.body.date) {
    date = new Date(req.body.date);
  }
  const username = getUsernameById(userId);
  const log = {
    _id: userId,
    description: description,
    duration: Number(duration),
    date: date.toISOString().split("T")[0],
  };
  logs.push(log);

  res.json({
    username: username,
    description: description,
    duration: Number(duration),
    date: date.toDateString(),
    _id: userId,
  });
});
app.get("/api/users", (req, res) => {
  res.json(users);
});
app.get("/api/users/:_id/logs", (req, res) => {
  const id = req.params._id;
  const arr = logs.filter((obj) => obj._id === id);
  let modifyArr = arr.map((l) => ({
    description: l.description,
    duration: l.duration,
    date: l.date,
  }));
  const { from, to, limit } = req.query;
  const user = getUsernameById(id);

  if (from || to) {
    const filteredLogs = findSpecificDates(modifyArr, from, to);

    modifyArr = filteredLogs;
  }
  const modifedDateArrr = modifyArr.map((l) => ({
    description: l.description,
    duration: l.duration,
    date: new Date(l.date).toDateString(),
  }));
  res.json({
    username: user,
    count: arr.length,
    _id: id,
    log: modifedDateArrr.slice(0, limit),
  });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
