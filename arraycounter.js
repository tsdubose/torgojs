//Accepts an array of arrays as input and counts the number of items in each array, returning an object that contains the % of times
//each item was found, rounded to 3 decimals.
/* Ex: {
totalItems: 95,
3: 5, <- Indicates that a length of 3 was found five times
4: 6 <- Indicates that a length of 4 was found 6 times etc
}
*/
module.exports = function (arrays) {
	console.log(arrays.length);
	let countingData = {};
	arrays.forEach(function (item) {
		if (Object.keys(countingData).includes(item.length.toString())) {
			countingData[item.length] += 1;
		}
		else {
			countingData[item.length] = 1;
		}
	});
	for (var key in countingData) {
		if (countingData.hasOwnProperty(key)) {
			countingData[key] = Math.round((countingData[key] / arrays.length) * 1000)  / 1000;
		}
	}
	return countingData;
};
