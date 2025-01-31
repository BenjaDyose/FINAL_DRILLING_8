const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const express = require("express");

const router = express.Router();

router.post("/signup", [verifySignUp.verifySignUp], controller.createUser);
router.post("/signin", controller.signIn);

router.get("/:id", [authJwt.verifyToken], controller.findUserById);
router.get("/", [authJwt.verifyToken], controller.findAll);
router.put("/:id", [authJwt.verifyToken], controller.updateUserById);
router.delete("/:id", [authJwt.verifyToken], controller.deleteUserById);

module.exports = router;