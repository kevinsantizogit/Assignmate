const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.TPL.tasksnav = true;
  next();
});

router.get("/", (req, res) => {
  req.TPL.pageTitle = "Tasks";
  req.TPL.tasksnav = true;

  req.TPL.tasks = [
    { title: "Finish Deliverable", course: "4WP3" },
    { title: "Configure SQL", course: "4WP3" }
  ];
  res.render("tasks", req.TPL);
});

module.exports = router;