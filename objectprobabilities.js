//Give an object with numbered properties on it, this function returns a property based on its frequency.
// FIXME: Right now, this is going to break on empty objects, of which there are many.
module.exports = async function(obj) {
	let probArray = [];
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === "number") {
				for (let i = 0; i < obj[key]; i++) {
					probArray.push(key);
				}
			} else if (typeof obj[key].total === "number") {
				for (let i = 0; i < obj[key].total; i++) {
					probArray.push(key);
				}
			}
			// else {
			// 	throw new Error("Could not find the probability of a particular feature occurring.")
			// }
		}
	}
	return probArray[getRandom(0, probArray.length)];
};

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
