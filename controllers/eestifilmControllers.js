const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
const dateTimeET = require("../src/dateTimeET.js");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for Estonian movie section
//@route GET /eestifilm
//@access public

const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

//@desc Page for people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed
//@access public


const filmPeople = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [rows, fields] = await conn.execute(sqlReq);
		rows.forEach(person => {
  	person.bornFormatted = dateTimeET.longDate(person.born);
	});
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc Page for adding people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
};

//@desc Page for submitting people involved in Estonian movie industry
//@route POST /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
		return;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
		console.log("Salvestati kirje id: " + result.insertId);
		res.render("filmiinimesed_add", {notice: "Andmed edukalt salvestatud!"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc Page for professions involved in movie industry
//@route GET /eestifilm/ametid
//@access public

const filmPosition = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM position";
    try {
        conn = await mysql.createConnection(dbConf);
        const [rows, fields] = await conn.execute(sqlReq);
        console.log(rows);
        res.render("filmiametid", {positionList: rows});
    }
    catch(err) {
        console.log(err);
        res.render("filmiametid", {positionList: []});
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};

//@desc Page for people involved in Estonian movie industry
//@route GET /eestifilm/ametid_add
//@access public

const filmPositionAdd = (req, res)=>{
	res.render("filmiametid_add", {notice: "Ootan sisestust!"});
};

//@desc Page for people involved in Estonian movie industry
//@route POST /eestifilm/ametid_add
//@access public

const filmPositionAddPost = async (req, res)=>{
	console.log(req.body);
	if(!req.body.positionNameInput){
		return res.render("filmiametid_add", {notice: "Palun kirjuta ameti nimetus!"});
	}

	let conn;
	try {
		conn = await mysql.createConnection(dbConf);

		let positionDescription = null;
		if(req.body.positionDescriptionInput != ""){
			positionDescription = req.body.positionDescriptionInput;
		}

		let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes)=>{
			if(err){
				res.render("filmiametid_add", {notice: "Tekkis tehniline viga: " + err});
			}
			else {
				res.redirect("/eestifilm/ametid");
			}
		});
	} catch (err) {
		console.error(err);
		res.render("filmiametid_add", {notice: "Tekkis tehniline viga andmebaasiga ühendamisel!"});
	}
};

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost
};