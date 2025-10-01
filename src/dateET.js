//function tellDateET() {
exports.tellDateET = function(){
	let timeNow = new Date();
	const monthsNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return "Täna on " + timeNow.getDate() + ". " + monthsNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

