const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  summarizeReport,
} = require("../controllers/reportController");

const upload = multer({
  dest: "uploads/reports/",
});

router.post(
  "/summarize",
  upload.single("report"),
  summarizeReport
);

module.exports = router;