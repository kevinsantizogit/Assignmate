const express = require("express");
const router = express.Router();
const TasksModel = require("../models/tasks.model");

router.get("/", async (req, res) => {
  try {
    req.TPL.pageTitle = "Tasks";
    req.TPL.tasksnav = true;

    const tasks = await TasksModel.getAll();

    req.TPL.tasks = tasks;
    req.TPL.taskCount = tasks.length;

    req.TPL.incompleteCount = tasks.filter(t => t.completed === 0).length;
    req.TPL.completeCount = tasks.filter(t => t.completed === 1).length;

    req.TPL.courses = [...new Set(tasks.map(t => t.course))].sort();

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