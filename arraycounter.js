//Accepts an array of arrays as input and counts the number of items in each array, returning an object that contains the number of times
//each item was found, rounded to 3 decimals.
/* Ex: {
totalItems: 95,
3: 5, <- Indicates that a length of 3 was found 5 times
4: 6 <- Indicates that a length of 4 was found 6 times etc
}
*/
module.exports = function(arrays) {
	let countingData = {};
	for (let i = 0; i < arrays.length; i++) {
		if (Object.keys(countingData).includes(arrays[i].length.toString())) {
			countingData[arrays[i].length] += 1;
		} else {
			countingData[arrays[i].length] = 1;
		}
	}
	return countingData;
};
