const express = require("express");
const router= express.Router();

//Insert Model
const Machine= require("../model/Machine");
//set user controller
const machineControllers=require("../controllers/machineControllers");

router.get("/", machineControllers.getMachine);
router.post("/", machineControllers.addMachine);
router.get("/:id", machineControllers.getById);
router.put("/:id", machineControllers.updateMachine);
router.delete("/:id", machineControllers.deleteMachine);

//export
module.exports= router;