const express = require("express");
const router = express.Router();

const {
  analyzeSymptoms,
} = require("../controllers/aiController");

router.post("/symptoms", analyzeSymptoms);

module.exports = router;