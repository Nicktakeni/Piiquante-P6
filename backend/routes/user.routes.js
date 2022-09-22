/* Import des modules necessaires */
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.controllers");
const GuardLimiter = require("../middlewares/GuardLimiter");
const GuardPasswordValidator = require("../middlewares/GuardPasswordValidator");

/* Routage User */
router.post("/signup", GuardPasswordValidator, userCtrl.signup);
router.post("/login", GuardLimiter, userCtrl.login);

module.exports = router;
