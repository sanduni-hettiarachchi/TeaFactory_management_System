const express = require("express");
const router = express.Router();
const middleware = require('../middleware');
const { changePassword } = require("../controllers/settingController");

router.put("/change-password", middleware, changePassword);


module.exports = router;