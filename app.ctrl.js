const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  req.TPL = {};
  req.TPL.appName = "Assignmate";
  next();
});

app.use("/", require("./controllers/home.ctrl"));
app.use("/tasks", require("./controllers/tasks.ctrl"));

app.listen(PORT, () => {
  console.log(`Running: http://localhost:${PORT}`);
});