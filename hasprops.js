/* A short module that tests objects to see if they have any properties on them.
Used to see if the objects I'm returning from some of the parsing modules have actually
run properly. */
module.exports = function (obj) {
	for(var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return true;
		}
	}
	return false;
};
