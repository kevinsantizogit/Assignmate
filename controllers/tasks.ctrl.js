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
    res.status(500).send("Could not load tasks.");
  }
});

router.get("/new", (req, res) => {
  req.TPL.pageTitle = "New Task";
  req.TPL.tasksnav = true;
  res.render("new", req.TPL);
});

router.post("/", async (req, res) => {
  try {
    const task = {
      title: req.body.title,
      course: req.body.course,
      task_type: req.body.task_type,
      due_date: req.body.due_date,
      notes: req.body.notes,
      grade_weight: req.body.grade_weight ? Number(req.body.grade_weight) : null
    };
    await TasksModel.create(task);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not create task.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const task = await TasksModel.getById(id);
    if (!task) return res.status(404).send("Task not found.");
    req.TPL.pageTitle = "Task Details";
    req.TPL.tasksnav = true;
    req.TPL.task = task;
    res.render("task", req.TPL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not load task.");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const task = await TasksModel.getById(id);
    if (!task) return res.status(404).send("Task not found.");
    req.TPL.pageTitle = "Edit Task";
    req.TPL.tasksnav = true;
    req.TPL.task = task;
    res.render("edit", req.TPL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not load edit page.");
  }
});

router.post("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const task = {
      title: req.body.title,
      course: req.body.course,
      task_type: req.body.task_type,
      due_date: req.body.due_date,
      notes: req.body.notes,
      grade_weight: req.body.grade_weight ? Number(req.body.grade_weight) : null
    };
    await TasksModel.update(id, task);
    res.redirect(`/tasks/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not update task.");
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await TasksModel.remove(id);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not delete task.");
  }
});

router.post("/:id/toggle", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await TasksModel.toggleComplete(id);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not toggle task.");
  }
});

module.exports = router;