const express = require("express");
const router = express.Router();

const {
  saveHeaderCoa1,
  getHeaderCoa1,
  saveHeaderCoa2,
  getHeaderCoa2,
  saveHeaderCoa3,
  getHeaderCoa3,
  saveHeaderCoa4,
  getHeaderCoa4,
  saveHeaderCoa5,
  getHeaderCoa5,
} = require("../controller/documentController");

const { requireSignin } = require("../controller/authController");

router.post("/saveHeaderCoa1", requireSignin, saveHeaderCoa1);
router.get("/listHeaderCoa1", requireSignin, getHeaderCoa1);

router.post("/saveHeaderCoa2", requireSignin, saveHeaderCoa2);
router.get("/listHeaderCoa2", requireSignin, getHeaderCoa2);

router.post("/saveHeaderCoa3", requireSignin, saveHeaderCoa3);
router.get("/listHeaderCoa3", requireSignin, getHeaderCoa3);

router.post("/saveHeaderCoa4", requireSignin, saveHeaderCoa4);
router.get("/listHeaderCoa4", requireSignin, getHeaderCoa4);

router.post("/saveHeaderCoa5", requireSignin, saveHeaderCoa5);
router.get("/listHeaderCoa5", requireSignin, getHeaderCoa5);

module.exports = router;
