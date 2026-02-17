const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dateTimeET = require("../src/dateTimeET")
const path = require('path');
const pool = require("../src/dbPool");


/* const dbInfo = require("../../../vp2025config");
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}; */

//@desc Home page for news
//@route GET /news
//@access public
const newsHomePage = async (req, res)=>{
    //let conn;
    try {
      //conn = await mysql.createConnection(dbConf);
      const now = new Date();
      let sqlReq = "SELECT title, content, added, expire, photofilename, alttext, userid FROM news where expire > ? order by added DESC";
      const [rows, fields] = await pool.execute(sqlReq, [now]);
      res.render("news", {news:rows});
    }
    catch(err){
      console.log(err);
      res.render("news", {news: [] });
    }
    finally {
      /* if(conn){
        await conn.end();
      } */
    }
};

//@desc Page for adding news
//@route GET /news/news_add
//@access public

const newsAddPage = (req, res)=>{
	res.render("news_add", {notice: "Ootan sisestust"});
};

//@desc Page for adding news
//@route POST /news/news_add
//@access public

const newsAddPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		let fileName = null;
		if (req.file){
			fileName = "vp_" + Date.now() + ".jpg";
			//console.log(fileName);
			await fs.rename(req.file.path, req.file.destination + fileName);
			await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/news_photos/normal/" + fileName);
		}
		//conn= await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO news (title, content, expire, photofilename, alttext, userid) VALUES(?,?,?,?,?,?)";
		const userId = 1;
		const [result] = await pool.execute(sqlReq, [req.body.titleInput, req.body.contentInput, req.body.expireInput, fileName, req.body.altInput, userId]);
		res.redirect("/news");
	}
	catch(err){
		console.log(err);
		res.redirect("/news");
	}
	finally {
		/* if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		} */
	}
};

//@desc Show only newest news (homepage)
//@route GET /
//@access public
const newsHomeLatest = async (req, res) => {
    //let conn;
    try {
        //conn = await mysql.createConnection(dbConf);
        const now = new Date();

        let sqlReq = `
            SELECT title, content, added, expire, photofilename, alttext, userid 
            FROM news 
            WHERE expire > ? 
            ORDER BY added DESC 
            LIMIT 1
        `;

        const [rows] = await conn.execute(sqlReq, [now]);

        // rows[0] is the single newest item
        res.render("homepage", { latestNews: rows[0] || null });

    } catch (err) {
        console.log(err);
        res.render("/", { latestNews: null });
    } finally /* {
        if (conn) await conn.end();
    } */
};

module.exports = {
	newsHomePage,
	newsAddPage,
	newsAddPagePost,
	newsHomeLatest
};