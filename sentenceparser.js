/*The function that sorts the sentences, no matter their category, into their proper places.
Expects the array of semantic blocks and the character and theme data as its two
arguments.*/
// TODO: Need to think about the commas surrounding dialogue tags, probably take them all out and then put them in manually.
const lowerCase = /^[a-z]$/;
const rita = require('rita');
const sortParts = require('./objectsorter.js');
const arrayIncludes = require('./arrayincludes.js');
const hasProps = require('./hasprops.js');
const flatten = require('./flatten.js');
const titles = ["Adm", "Capt", "Cmdr", "Col", "Dr", "Gen", "Gov", "Lt", "Maj", "Messrs", "Mr", "Mrs", "Ms", "Prof", "Rep", "Reps", "Rev", "Sen", "Sens", "Sgt", "Sr", "St", "Miss"];
module.exports = function(semBlocks, charAndTheme) {
	var sentenceData = {
		narration: {},
		dialogue: {},
		diaTag: {}
	};
	//Create an array of theme keys and an array with all the words inside the theme
	//object for later testing.
	const themeKeys = Object.keys(charAndTheme);
	const flatThemes = flatten(
		themeKeys.map(function(key) {
			return charAndTheme[key];
		}));
	return new Promise(function(resolve, reject) {
		//Create a variable to hold the sentence type, so that the sentences can be
		//properly sorted. Also create a placeholder to use in the next for loop to
		//improve readability.
		var sentType, thisBlock;
		for (let i = 0; i < semBlocks.length; i++) {
			thisBlock = semBlocks[i];
			if (thisBlock[0][0] == "“") {
				sentType = "dialogue";
			} else if (lowerCase.test(thisBlock[0][0])) {
				sentType = "diaTag";
			} else {
				sentType = "narration";
			}
			//Run through the semantic block and categorize each sentence.
			for (let n = 0; n < thisBlock.length; n++) {
				try {
					let cleanItem = thisBlock[n].replace(/[“”]/g, "");
					//Take each sentence, tokenize it, then test to see if it includes any characters or themes.
					let tokens = rita.tokenize(cleanItem);
					let posTags = rita.getPosTags(cleanItem);
					//Check to see if the tokens include any of the characters or themes. If so, append them to the POS tags array.
					// TODO: There are serious readability issues here.
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
					//and then replace the posTags with that exact title, also grabbing any periods that come next.
					for (let t = 0; t < tokens.length; t++) {
						if (titles.includes(tokens[t])) {
							posTags[t] = tokens[t];
							if (posTags[t + 1] == ".") {
								posTags[t] += ".";
								posTags.splice(t + 1, 1);
							}
						}
					}
					//Sort the sentences into probabilities. Check to see if that sentence type has a sentence of that length and then call the function that sorts probabilities.
					var sentenceLengths = Object.keys(sentenceData[sentType]);
					if (!sentenceLengths.includes(posTags.length.toString())) {
						sentenceData[sentType][posTags.length] = {};
						sentenceData[sentType][posTags.length].starts = {};
						sentenceData[sentType][posTags.length].total = 0;
					}
					sentenceData[sentType][posTags.length].total += 1;
					sentenceData[sentType][posTags.length] = sortParts(posTags, sentenceData[sentType][posTags.length]);
				} catch (e) {
					console.log("RiTa could not process a word.");
				}

			}
		}
		for (var key in sentenceData) {
			if (sentenceData.hasOwnProperty(key)) {
				if (hasProps(sentenceData[key])) {
					let resolvedSentenceData = {
						sentence: sentenceData
					};
					resolve(resolvedSentenceData);
					break;
				}
				else {
					reject("Sentence data could not be calculated.");
				}
			}
		}
	});
};
