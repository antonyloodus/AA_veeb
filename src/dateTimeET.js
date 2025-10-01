const tellDateET = function(){
	let timeNow = new Date();
	const monthsNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return timeNow.getDate() + ". " + monthsNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const tellWeekdayET = function() {
	const timeNow = new Date();
	const weekdaysET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return weekdaysET[timeNow.getDay()];
}

const tellTimeET =function() {
	const timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

module.exports = {longDate: tellDateET, weekDay: tellWeekdayET, time: tellTimeET};