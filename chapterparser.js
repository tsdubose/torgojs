// const flatten = require('flatten.js');
//Expects the whole data structure, minus the shaved off raw text, as an input.
//Returns a promise with an object of the form detailed below. This will need to be cleaned up.
//TODO: If not here then elsewhere: I need to do some type checking and throw errors.
//TODO: I don't think I'm gathering the right totals here, but it doesn't matter yet.
module.exports = function (chapters) {
	//Inititalize the data structure, so that you don't have to test for it later.
	let chapterData = {
		length: {
			total: 0
		},
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
		chapterData.length.total = 0;
		try {
			chapters.forEach(function (chapter) {
				chapterData.length.total += chapter.length;
				if (Object.keys(chapterData.length).includes(chapter.length.toString())) {
					chapterData.length[chapter.length] += 1;
				}

				else {
					chapterData.length[chapter.length] = 1;
				}

				chapter.forEach(function (paragraph, index, a) {
					let current = narrOrDia(paragraph);
					let next = narrOrDia(a[index + 1]);

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
				});
			});
			resolve(chapterData);
		} catch (e) {
			reject(e);
		}
	});

}

function narrOrDia(paragraph) {
	if (paragraph && typeof paragraph === "string") {
		return paragraph[0] === "“" ? "dialogue" : "narration";
	}
	else {
		return;
	}
}
