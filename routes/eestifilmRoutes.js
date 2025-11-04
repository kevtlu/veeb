const express = require("express");
const router = express.Router();

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost,
	film,
	filmAdd,
	filmAddPost,
	filmRelation,
	filmRelationAdd,
	filmRelationAddPost
} = require("../controllers/eestifilmControllers");

router.route("/").get(filmHomePage);
router.route("/filmiinimesed").get(filmPeople);
router.route("/filmiinimesed_add").get(filmPeopleAdd);
router.route("/filmiinimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/amet_add").get(filmPositionAdd);
router.route("/amet_add").post(filmPositionAddPost);
router.route("/film").get(film);
router.route("/film_add").get(filmAdd);
router.route("/film_add").post(filmAddPost);
router.route("/seosed").get(filmRelation);
router.route("/seosed_add").get(filmRelationAdd);
router.route("/seosed_add").post(filmRelationAddPost);

module.exports = router;