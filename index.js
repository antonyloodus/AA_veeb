const express = require("express");
const dateEt = require("./src/dateTimeET");
//lisan andmebaasiga suhtlemise paketi
const mysql = require("mysql2");
//lisan andmebaasi juurdepääsu info
const dbInfo = require("../../vp2025config");
const fs = require("fs");
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
//loome rakenduse, mis käivitab express raamistiku
const app = express();
//määran lehtede renderdaja (view engine)
app.set("view engine", "ejs");
//muudame public kataloogi veebiserverile kättesaadavaks
app.use(express.static("public"));
//asun päringut parsima. Parameeter lõpus on false, kui ainult tekst ja true, kui muud infot ka.
app.use(bodyparser.urlencoded({extended: false}));

//loome andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});

app.get("/", (req, res)=>{
	//res.send("Express.js rakendus läkski käima!");
	res.render("index");
});

app.get("/", (req, res)=>{
res.render("timenow", {wd: dateEt.weekDay(), date: dateEt.longDate()});
});

app.get("/vanasonad", (req, res)=>{
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {h2: "Vanasõnad", listData: ["Vabandame, ühtki vanasõna ei leitud!"]});
		}
		else {
			res.render("genericlist", {h2: "Vanasõnad", listData: data.split(";")});
		}
	});
});
	
app.get("/regvisit", (req, res)=>{
	res.render("reqvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " kell " + dateEt.time() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, lihtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			let listData = data.split(";");
			res.render("genericlist", {h2: "Registreeritud külastused", listData: listData});
		}
	});
});

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/filmiinimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	//conn.query eksisteerib ka
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiinimesed", {personList:[]});
		}
		else {
			console.log(sqlRes);
		res.render("filmiinimesed", {personList: sqlRes});
		}
	});
});
	//res.render("filmiinimesed");
	
app.get("/eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	//kontrollime andmeid
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
	}
	else {
		let deceasedDate = null;
		if (req.body.deceasedInput && req.body.deceasedInput.trim() !== '') {
			deceasedDate = req.body.deceasedInput;
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlRes)=>{
			if(err){
				console.log(err);
				res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga: " + err});
			} else {
				res.render("filmiinimesed_add", {notice: "Andmed edukalt salvestatud!"});
			}
		});
	}
});

app.listen(5327);