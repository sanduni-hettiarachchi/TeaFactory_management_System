const express = require("express");
const router = express.Router();
const middleware = require('../middleware');
const { addLeave, getLeave, getEmpLeave, getLeaveDetails, updateLeave } = require("../controllers/leaveController");

router.post("/add", middleware, addLeave);
router.get("/detail/:id", middleware, getLeaveDetails);
router.get("/:id/:role", middleware, getLeave);
router.put("/:id", middleware, updateLeave);
router.get("/", middleware, getEmpLeave);


module.exports = router;