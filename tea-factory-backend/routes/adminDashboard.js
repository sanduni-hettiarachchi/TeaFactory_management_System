const express = require("express");
const router = express.Router();
const middleware = require('../middleware');
const { getSummary } = require("../controllers/adminDashboardController");


router.get("/summary", middleware, getSummary);



module.exports = router;