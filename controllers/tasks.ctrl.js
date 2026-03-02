const express = require("express");
const router = express.Router();
const TasksModel = require("../models/tasks.model");
const { validateTask } = require("../models/validate");

router.get("/", async (req, res) => {
  try {
    req.TPL.pageTitle = "Tasks";
    req.TPL.tasksnav = true;

    const tasks = await TasksModel.getAll();

    const search = (req.query.search || "").trim().toLowerCase();
    const course = (req.query.course || "").trim();
    const status = (req.query.status || "").trim();

    let filtered = tasks;

    if (course) {
      filtered = filtered.filter(t => t.course === course);
    }

    if (status === "complete") {
      filtered = filtered.filter(t => t.completed === 1);
    } else if (status === "incomplete") {
      filtered = filtered.filter(t => t.completed === 0);
    }

    if (search) {
      filtered = filtered.filter(t =>
        (t.title || "").toLowerCase().includes(search) ||
        (t.course || "").toLowerCase().includes(search) ||
        (t.task_type || "").toLowerCase().includes(search) ||
        (t.notes || "").toLowerCase().includes(search)
      );
    }

    req.TPL.incompleteCount = tasks.filter(t => t.completed === 0).length;
    req.TPL.completeCount = tasks.filter(t => t.completed === 1).length;

    const courseList = [...new Set(tasks.map(t => t.course))].sort();
    req.TPL.courses = courseList.map(c => ({ name: c, selected: c === course }));

    req.TPL.search = req.query.search || "";
    req.TPL.statusIncomplete = status === "incomplete";
    req.TPL.statusComplete = status === "complete";

    req.TPL.tasks = filtered;
    req.TPL.taskCount = filtered.length;

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
    const result = validateTask(req.body);

    if (!result.ok) {
      req.TPL.pageTitle = "New Task";
      req.TPL.tasksnav = true;
      req.TPL.errors = result.errors;
      req.TPL.form = {
        title: req.body.title || "",
        course: req.body.course || "",
        task_type: req.body.task_type || "",
        due_date: req.body.due_date || "",
        grade_weight: req.body.grade_weight || "",
        notes: req.body.notes || ""
      };
      return res.status(400).render("new", req.TPL);
    }

    await TasksModel.create(result.clean);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not create task.");
  }
});

router.post("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await TasksModel.getById(id);
    if (!existing) return res.status(404).send("Task not found.");

    const result = validateTask(req.body);

    if (!result.ok) {
      req.TPL.pageTitle = "Edit Task";
      req.TPL.tasksnav = true;
      req.TPL.errors = result.errors;
      req.TPL.task = {
        id,
        title: req.body.title || "",
        course: req.body.course || "",
        task_type: req.body.task_type || "",
        due_date: req.body.due_date || "",
        grade_weight: req.body.grade_weight || "",
        notes: req.body.notes || ""
      };
      return res.status(400).render("edit", req.TPL);
    }

    await TasksModel.update(id, result.clean);
    res.redirect(`/tasks/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not update task.");
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