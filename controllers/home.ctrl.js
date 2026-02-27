const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.TPL.pageTitle = "Home";
  req.TPL.homenav = true;
  res.render("home", req.TPL);
});

module.exports = router;