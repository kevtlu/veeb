const express = require("express");
const router = express.Router();

module.exports = {
	registerPage,
	registerPagePost,
	logPage
} = require("../controllers/visitControllers");

router.route("/").get(registerPage);
router.route("/").post(registerPagePost);
router.route("/log").get(logPage);

module.exports = router;