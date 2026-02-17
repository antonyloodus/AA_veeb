const express = require('express');
const router = express.Router();
const multer = require("multer");

//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/news_photos/orig/"});

const {
    newsHomePage,
    newsAddPage,
    newsAddPagePost
} = require('../controllers/newsControllers');

router.route('/').get(newsHomePage);
router.route('/news_add').get(newsAddPage);
router.route("/news_add").post(uploader.single("newsPhotoInput"),newsAddPagePost);

module.exports = router;