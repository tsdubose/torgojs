//Accepts an array of arrays as input and counts the number of items in each array, returning an object that contains the % of times
//each item was found, rounded to 3 decimals.
/* Ex: {
totalItems: 95,
3: 5, <- Indicates that a length of 3 was found five times
4: 6 <- Indicates that a length of 4 was found 6 times etc
}
*/
module.exports = function (arrays) {
	let countingData = {};
	arrays.forEach(function (item) {
		if (Object.keys(countingData).includes(item.length.toString())) {
			countingData[item.length] += 1;
		}
		else {
			countingData[item.length] = 1;
		}
	});
	return countingData;
};
