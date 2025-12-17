const express = require("express");
const { getAttendance, updateAttendance, attendanceReport } = require("../controllers/attendanceController");
const defaultAttendance = require("../defaultAttendance");
const verifyUser = require("../middleware");
const router = express.Router();


// Routes
router.get("/",verifyUser, defaultAttendance, getAttendance);
router.put("/update/:employeeId",verifyUser, updateAttendance);
router.get("/report",verifyUser, attendanceReport);


module.exports = router;