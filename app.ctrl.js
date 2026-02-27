const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Assignmate is up");
});

app.listen(PORT, () => {
  console.log(`Running: http://localhost:${PORT}`);
});