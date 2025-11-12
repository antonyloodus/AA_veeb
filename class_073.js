//Asünkroonsus
//Kasutame sisseehitatud promise lähenemist
//kasutame async funktsiooni


const fs = require("fs").promises;
const textRef = "txt/vanasonad.txt";

function pickOneValue(rawValue) {
	let oldWisdomList = rawValue.split(";");
	let WisdomCount = oldWisdomList.length;
	let randomNumber = Math.round(Math.random() * (WisdomCount - 1));
	return("Tänane vanasõna: " + oldWisdomList[randomNumber]);
}

//defineerin asünkroonse funktsiooni
const readTextFile = async function(){
	//käsud, mida üritatakse järjest täita
	try {
		const data = await fs.readFile(textRef, "utf8")
		const todaysWisdom = await pickOneValue(data);
		console.log(todaysWisdom);
	}
	//käsu veahalduseks
	catch(err) {
		console.log("Kahjuks tekkis viga: " + err);
	}
	//mis lõpuks nkn äre teha tuleb
	finally {
		console.log("Ongi kõik!")
	}
}

console.log ("Hakkame peale!")
readTextFile();


/* fs.readFile(textRef, "utf8")
	.then((data)=>console.log(pickOneValue(data)))
	.catch((err)=>console.log("Viga: " + err)); */

