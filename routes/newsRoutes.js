/*  const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploader = multer({dest: "./public/newsphotos/orig/"});

const { 
    newsHome,
	addNewsPage, 
	addNewsPost
} = require("../controllers/newsControllers"); 

router.route("/").get(newsHome);
router.route("/add").get(addNewsPage);
router.route("/add").post(uploader.single("photoInput"), addNewsPost);

module.exports = router; */