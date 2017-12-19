//I'm going to need this function in multiple places, might as well make it a module.
module.exports = function (array) {
	return array.reduce(function (a, b) {
		return a.concat(b);
	});
}
