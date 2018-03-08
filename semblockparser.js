const arrayCounter = require('./arraycounter.js');
const hasProps = require('./hasprops.js');
/*This function counts the semantic blocks and considers the number of sentences in each.
It takes an array of semantic blocks as its only argument.*/
module.exports = function(semBlocks) {
	return new Promise(function(resolve, reject) {
		var semBlockData = arrayCounter(semBlocks);
		if (hasProps(semBlockData)) {
			let resolvedSemBlockData = {
				semBlock: semBlockData
			};
			resolve(resolvedSemBlockData);
		}
		else {
			reject("Could not calculate the chapter data.");
		}
	});
};
