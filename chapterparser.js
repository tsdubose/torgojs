// const flatten = require('flatten.js');
//Expects the whole text data array, minus the shaved off raw text, as an input.
//Returns a promise with an object of the form detailed below. This will need to be cleaned up.
//TODO: I need to do some type checking and throw errors, look for reasons to reject.
//TODO: I don't think I'm gathering the right totals here, but it doesn't matter yet.
const arrayCounter = require('./arraycounter.js');
module.exports = function (chapters) {
	//Inititalize the data structure, so that you don't have to test for it later.
	let chapterData = {
		structure : {
			dialogue: {
					starts: 0,
					following: {
						dialogue: 0,
						narration: 0
					},
					total: 0
			},
			narration: {
				starts: 0,
				following: {
					dialogue: 0,
					narration: 0
				},
				total: 0
			}
		}
	};

	return new Promise(function(resolve, reject) {
			chapterData.chLength = arrayCounter(chapters);
			chapters.forEach(function (chapter) {
				chapter.forEach(function (paragraph, index, a) {
					let current = narrOrDia(paragraph);
					let next = narrOrDia(a[index + 1]);

					if (current) {
						if (index == 0) {
							chapterData.structure[current].starts += 1;
							chapterData.structure[current].total += 1;
							if (next) {
								chapterData.structure[current].following[next] += 1;
							}
						}
						else {
							chapterData.structure[current].total += 1;
							if (next) {
								chapterData.structure[current].following[next] += 1;
							}
						}
					}
				});
			});
			resolve(chapterData);
	});

};

function narrOrDia(paragraph) {
	if (paragraph && typeof paragraph === "string") {
		return paragraph[0] === "“" ? "dialogue" : "narration";
	}
	else {
		return null;
	}
}
