
module.exports = function (container, testArray) {
	return container.some(function (item) {
		return testArray.includes(item);
	});
};
