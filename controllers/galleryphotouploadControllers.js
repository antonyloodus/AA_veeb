const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");
const dateTimeET = require("../src/dateTimeET.js");
const watermarkFile = "./public/images/vp_logo_small.png";

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for uploading gallery photos
//@route GET /galleryphotoupload
//@access public

const galleryphotouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};

//@desc page for adding gallery photos
//@route POST /galleryphotoupload
//@access public

const galleryphotouploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		// loon normaalmõõdus foto (800x600)
		await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		// loon pisipildi(100x100)
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		res.render("galleryphotoupload");
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO galleryphotos (filename, orig_name, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		//kuna kasutajakontosid pole, siis id on 1
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Lisati foto id: " + result.insertId);
	}
	catch(err){
		console.log(err);
		res.render("galleryphotoupload");
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
	
};

module.exports = {
	galleryphotouploadPage,
	galleryphotouploadPagePost
};