const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "assignmate.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      course TEXT NOT NULL,
      task_type TEXT NOT NULL,
      due_date TEXT NOT NULL,
      notes TEXT,
      grade_weight REAL,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.get(`SELECT COUNT(*) AS count FROM tasks`, (err, row) => {
    if (err) {
      console.error(err);
      db.close();
      return;
    }

    if (row.count > 0) {
      console.log("DB already has data, skipping seed.");
      db.close();
      return;
    }

    const stmt = db.prepare(`
      INSERT INTO tasks (title, course, task_type, due_date, notes, grade_weight, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const seed = [
      ["Weekly Reading Quiz", "ENGTECH 3ET0", "Presentation", "2026-02-28", "Chapters 3–4", 5.0, 0],
      ["Study for Midterm", "SFFWRTECH 4ES3", "Exam", "2026-03-05", "Review + Matlab Assignment", 20.0, 0],
      ["Finish Milestone", "SFFWRTECH 4WP3", "Project", "2026-03-01", "SQLite + actions", 15.5, 1]
    ];

    for (const row of seed) stmt.run(row);

    stmt.finalize(() => {
      console.log("Seeded database with starting data");
      db.close();
    });
  });
});