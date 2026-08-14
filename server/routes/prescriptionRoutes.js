const express = require("express");
const multer = require("multer");

const {
  analyzePrescriptionController,
} = require("../controllers/prescriptionController");

const router = express.Router();

// Upload Folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/prescriptions/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/analyze",
  upload.single("prescription"),
  analyzePrescriptionController
);

module.exports = router;