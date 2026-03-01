const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "db", "assignmate.db");

function openDb() {
  return new sqlite3.Database(dbPath);
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = openDb();
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = openDb();
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = openDb();
    db.run(sql, params, function (err) {
      db.close();
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

async function getAll() {
  return all(
    `SELECT id, title, course, task_type, due_date, notes, grade_weight, completed
     FROM tasks
     ORDER BY completed ASC, due_date ASC`
  );
}

async function getById(id) {
  return get(
    `SELECT id, title, course, task_type, due_date, notes, grade_weight, completed
     FROM tasks
     WHERE id = ?`,
    [id]
  );
}

async function create(task) {
  const result = await run(
    `INSERT INTO tasks (title, course, task_type, due_date, notes, grade_weight, completed)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [
      task.title,
      task.course,
      task.task_type,
      task.due_date,
      task.notes || null,
      task.grade_weight || null
    ]
  );
  return result.lastID;
}

async function update(id, task) {
  await run(
    `UPDATE tasks
     SET title = ?, course = ?, task_type = ?, due_date = ?, notes = ?, grade_weight = ?
     WHERE id = ?`,
    [
      task.title,
      task.course,
      task.task_type,
      task.due_date,
      task.notes || null,
      task.grade_weight || null,
      id
    ]
  );
}

async function remove(id) {
  await run(`DELETE FROM tasks WHERE id = ?`, [id]);
}

async function toggleComplete(id) {
  await run(
    `UPDATE tasks
     SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END
     WHERE id = ?`,
    [id]
  );
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleComplete
};