const express = require("express");
const router = express.Router();

// Model not needed here, controllers handle it
const technicianControllers = require("../controllers/technicianController");
const sendPdfController = require("../controllers/sendPdfController")

router.get("/", technicianControllers.getTechnicians);
router.post("/", technicianControllers.addTechnician);
router.get("/:id", technicianControllers.getTechnicianById);
router.put("/:id", technicianControllers.updateTechnician);
router.delete("/:id", technicianControllers.deleteTechnician);
router.post("/send-pdf/:id", sendPdfController.sendPdfToTechnician);

module.exports = router;