/* This is one of the primary modules of the parsing system.

It expects, as arguments, the list of characters and themes and the array of chapters. The array of chapters is immediately sent off to the chapter parser to get the number of chapters and the length, in paragraphs, of each one.

Then the array of chapters is flattened and sent off to the paragraph parser to return the data about the semantic blocks that make up each paragraph.

That array is then flattened again to get data about the semantic blocks and their lengths.

The array of semBlocks are then sent to the sentence parsers where they are reduced to their parts of speech.
Once all four modules have returned their values or failed, the returned objects are compiled into a single object and resolved.
*/

const chapterParse = require('./chapterparser.js');
const flatten = require('./flatten.js');
const parsePara = require('./paragraphparser.js');
const parseSemBlock = require('./semblockparser.js');
const parseSent = require('./sentenceparser.js');
// TODO: Move these to environment variables.
const ABBREVIATIONS = ["Adm.", "Capt.", "Cmdr.", "Col.", "Dr.", "Gen.", "Gov.", "Lt.", "Maj.", "Messrs.", "Mr.", "Mrs.", "Ms.", "Prof.", "Rep.", "Reps.", "Rev.", "Sen.", "Sens.", "Sgt.", "Sr.", "St.", "a.k.a.", "c.f.", "i.e.", "e.g.", "vs.", "v.", "Jan.", "Feb.", "Mar.", "Apr.", "Mar.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const dialogueTester = /(“[^”]*”)/g;

module.exports = function(charAndTheme, textArrays) {
	return new Promise(function(resolve, reject) {
		let chapterData = chapterParse(textArrays);

		let paragraphs = flatten(textArrays)
			.map((item) => {
				let cleanPara = item.replace(/\r\n/g, " ")
					.split(dialogueTester)
					.filter(para => para.length > 1)
					.map(string => splitSentences(string.trim()));
				return cleanPara;
			});
		let paraData = parsePara(paragraphs);
		let semBlocks = flatten(paragraphs);
		let semBlockData = parseSemBlock(semBlocks);
		let sentenceData = parseSent(semBlocks, charAndTheme);

		Promise.all([chapterData, paraData, semBlockData, sentenceData])
		.then((bookArray) => {
			let combinedData = Object.assign({}, ...bookArray);
			resolve(combinedData);
		})
		.catch(e => reject(e));
	});
};
//This is a copy of RiTa's splitSentences function with different regex, because they're still figuring out how they're going
//to deal with an issue I raised. I don't have time for them to figure it out.
function splitSentences(text) {
	var abbrs = ABBREVIATIONS,
		delim = '___',
		re = new RegExp(delim, 'g');

	function unescapeAbbrevs(arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].replace(re, ".");
		}
		return arr;
	}

	function escapeAbbrevs(text) {
		for (var i = 0; i < abbrs.length; i++) {
			var abv = abbrs[i],
				idx = text.indexOf(abv);
			while (idx > -1) {
				text = text.replace(abv, abv.replace('.', delim));
				idx = text.indexOf(abv);
			}
		}
		return text;
	}

	var arr = escapeAbbrevs(text).match(/(\S.+?[.!?]["”]?)(?=\s+|$)/g);
	return (text.length && arr && arr.length) ? unescapeAbbrevs(arr) : [text];
}
