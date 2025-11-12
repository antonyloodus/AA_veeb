//Asünkroonsus
//Kasutame sisseehitatud promise lähenemist

const fs = require("fs").promises;
const textRef = "txt/vanasonad.txt";	

function pickOneValue(rawValue) {
	let oldWisdomList = rawValue.split(";");
	let WisdomCount = oldWisdomList.length;
	let randomNumber = Math.round(Math.random() * (WisdomCount - 1));
	return("Tänane vanasõna: " + oldWisdomList[randomNumber]);
}

fs.readFile(textRef, "utf8")
	.then((data)=>console.log(pickOneValue(data)))
	.catch((err)=>console.log("Viga: " + err));
