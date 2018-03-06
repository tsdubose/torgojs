//Expects the whole text data array, minus the shaved off raw text, as an input.
//Returns a promise with an object giving the total number of chapters, and the number of paragraphs in each chapter.
//Note that the total number of chapters is captured as a key and given a value of 1: this is so the length of works can properly be combined later.
const arrayCounter = require('./arraycounter.js');
module.exports = function (chapters) {
	//Inititalize the data structure, so that you don't have to test for it later.
	let chapterData = {
		chLength: {}
	};

	return new Promise(function(resolve, reject) {
			chapterData[chapters.length] = 1;
			chapterData.chLength = arrayCounter(chapters);
			if (hasProps(chapterData.chLength)) {
				resolve(chapterData);
			}
			else {
				reject("Could not calculate the chapter data.");
			}

	});
};
function hasProps(obj) {
	for(var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return true;
		}
	}
	return false;
}
