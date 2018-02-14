//This function expects the array of chapters, and the object of characters and themes as input, flattens the chapters
//into a one-dimensional array of paragraphs, splits the paragraphs into sentences, analyzes the length of those paragraphs, then parses the grammar of the
//sentences, replacing characters and themes as appropriate. Returns a promise.

// IDEA: Think about places where the code here can be reused for the dialogue parser.
// IDEA: I think I might create an object prototype of "grammar holder" in order to better use some of the setter/getter behavior on the objects.
// TODO: Find a place to reject.
// TODO: There's mid-paragraph dialogue sneaking in that I need to deal with eventually.
const flatten = require('./flatten.js');
const rita = require('rita');
const arrayCounter = require('./arraycounter.js');
const arrayIncludes = require('./arrayincludes.js');
const sortSpeech = require('./partsofspeechsorter.js');

module.exports = function(chapters, charAndTheme) {
	let sentenceData = {};
	return new Promise(function(resolve) {
		//Flatten the chapters, filter out the dialogue and split each paragraph into an array of sentences for parsing.
		// console.log(chapters);
		let narration = flatten(chapters)
			.filter((paragraph) => paragraph[0] !== "“")
			.map((item) => {
				let cleanPara = item.replace(/\r\n/g, " ");
				return rita.splitSentences(cleanPara);
			});
		//Add the paragraph length data to the data structure.
		sentenceData.paraLength = arrayCounter(narration);
		//Take each sentence, tokenize it, then test to see if it includes any characters or themes.
		narration.forEach(function(paragraph) {
			paragraph.forEach(function(sentence) {
				let tokens = rita.tokenize(sentence);
				let posTags = rita.getPosTags(sentence);
				const themeKeys = Object.keys(charAndTheme);
				const flatThemes = flatten(
					themeKeys.map(function(key) {
						return charAndTheme[key];
					}));
				//Check to see if the tokens include any of the characters or themes. If so, append them to the POS tags array.
				if (arrayIncludes(tokens, flatThemes)) {
					tokens.forEach(function(word, index) {
						for (let i = 0; i < themeKeys.length; i++) {
							if (charAndTheme[themeKeys[i]].includes(word)) {
								posTags[index] += "--" + themeKeys[i];
								break;
							}
						}
					});
				}
				//The temporary solution to the Mr. problem: check against a hard-wired list of possibilities stolen from RiTa,
				//and then replace the posTags with that exact title, also grabbing and periods that come next.
				tokens.forEach(function (word, index) {
					const titles = ["Adm", "Capt", "Cmdr", "Col", "Dr", "Gen", "Gov", "Lt", "Maj", "Messrs", "Mr", "Mrs", "Ms", "Prof", "Rep", "Reps", "Rev", "Sen", "Sens", "Sgt", "Sr", "St"];
					if (titles.includes(word)) {
						posTags[index] = word;
						if (posTags[index + 1] == ".") {
							posTags[index] += ".";
							posTags.splice(index + 1, 1);
						}
					}
				});
				//Now it's time to actually start sorting the sentences into probabilities. Ah!
				const sentenceLengths = Object.keys(sentenceData);
				if (!sentenceLengths.includes(posTags.length.toString())) {
					sentenceData[posTags.length] = {};
					sentenceData[posTags.length].starts = {};
				}
				sentenceData[posTags.length] = sortSpeech(posTags, sentenceData[posTags.length]);
			});
		});
		resolve(sentenceData);
	});
};
