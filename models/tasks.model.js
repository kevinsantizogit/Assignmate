const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "db", "assignmate.db");

function getDb() {
  return new sqlite3.Database(dbPath);
}

function getAll() {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all(
      `SELECT id, title, course, task_type, due_date, notes, grade_weight, completed
       FROM tasks
       ORDER BY completed ASC, due_date ASC`,
      [],
      (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

module.exports = { getAll };