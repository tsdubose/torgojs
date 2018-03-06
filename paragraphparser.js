//This module expects, as input, an array of paragraphs that are themselves broken into semantic blocks. It analyzes each semantic block, categorizes it, and then examines what comes next. Resolves with an object that contains the paragraph data, including length and contents of its semantic blocks.
const sortParts = require('./objectsorter.js');
const hasProps = require('./hasprops.js');
const lowerCase = /^[a-z]$/;
module.exports = function (paragraphs) {
	var paragraphData = {};
	return new Promise(function(resolve, reject) {
		for (let i = 0; i < paragraphs.length; i++) {
			if (Object.keys(paragraphData).includes(paragraphs[i].length.toString())) {
				paragraphData[paragraphs[i].length].total += 1;
			} else {
				paragraphData[paragraphs[i].length] = {};
				paragraphData[paragraphs[i].length].starts = {};
				paragraphData[paragraphs[i].length].total = 1;
			}
			//Look at each semantic block, categorize it, consider what comes next.
			let semCats = paragraphs[i].map(function (item) {
				if (item[0][0] == "“") {
					return "dialogue";
				}

				else if (lowerCase.test(item[0][0])) {
					return "diaTag";
				}
				else {
					return "narration";
				}
			});

			paragraphData[paragraphs[i].length] = sortParts(semCats, paragraphData[paragraphs[i].length]);
		}
		if (hasProps(paragraphData)) {
			resolve(paragraphData);
		}
		else {
			reject("Was not able to calculate paragraph data.");
		}
	});
};
