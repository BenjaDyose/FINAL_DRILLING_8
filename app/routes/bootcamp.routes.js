const { authJwt } = require("../middleware");
const controller = require("../controllers/bootcamp.controller");
const express = require("express");

const router = express.Router();

router.post("/", [authJwt.verifyToken], controller.createBootcamp);
router.post("/adduser", [authJwt.verifyToken], controller.addUser);
router.get("/:id", [authJwt.verifyToken], controller.findById);
router.get("/", controller.findAll);

module.exports = router;