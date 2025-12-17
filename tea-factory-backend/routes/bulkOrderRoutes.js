const express = require("express");
const multer = require("multer");
const router = express.Router();
const ctrl = require("../controllers/bulkOrderController");

// Use memory storage; adjust to disk storage if you want to persist files
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", upload.array("documents", 5), ctrl.createBulkOrder);
router.get("/", ctrl.listBulkOrders);
router.patch("/:id/status", ctrl.updateStatus);
router.delete("/:id", ctrl.remove);

module.exports = router;
