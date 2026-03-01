const express = require("express");
const router = express.Router();
const TasksModel = require("../models/tasks.model");

router.get("/", async (req, res) => {
  try {
    req.TPL.pageTitle = "Tasks";
    req.TPL.tasksnav = true;
    req.TPL.tasks = await TasksModel.getAll();
    res.render("tasks", req.TPL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong loading tasks.");
  }
});

module.exports = router;