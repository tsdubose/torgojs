//I'm going to need this function in multiple places, might as well make it a module.
//Takes a two dimensional array and flattens it into a single array.
module.exports = function (array) {
	return array.reduce(function (a, b) {
		return a.concat(b);
	});
}
