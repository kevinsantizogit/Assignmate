function validateTask(input) {
  const errors = {};

  const title = (input.title || "").trim();
  const course = (input.course || "").trim();
  const task_type = (input.task_type || "").trim();
  const due_date = (input.due_date || "").trim();
  const notes = (input.notes || "").trim();
  const grade_weight_raw = (input.grade_weight || "").trim();

  if (!title) errors.title = "Title is required.";
  if (!course) errors.course = "Course is required.";
  if (!task_type) errors.task_type = "Task type is required.";
  if (!due_date) errors.due_date = "Due date is required.";

  if (title.length > 60) errors.title = "Title must be 60 characters or less.";
  if (course.length > 40) errors.course = "Course must be 40 characters or less.";
  if (task_type.length > 30) errors.task_type = "Task type must be 30 characters or less.";
  if (notes.length > 300) errors.notes = "Notes must be 300 characters or less.";

  if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
    errors.due_date = "Due date must be a valid date.";
  }

  let grade_weight = null;
  if (grade_weight_raw) {
    const num = Number(grade_weight_raw);
    if (Number.isNaN(num)) {
      errors.grade_weight = "Grade weight must be a number.";
    } else if (num < 0 || num > 100) {
      errors.grade_weight = "Grade weight must be between 0 and 100.";
    } else {
      grade_weight = num;
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    clean: { title, course, task_type, due_date, notes, grade_weight }
  };
}

module.exports = { validateTask };