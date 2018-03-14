/*This function expects, as input, the raw text as arg1 and the character and theme
info as arg2. With that, it takes the information and turns it into a Rita-parsible
dictionary for later consumption in building grammars.*/

// TODO: Need to do more testing and reject here somewhere.
const rita = require('rita');
const flatten = require('./flatten.js');

module.exports = function (corpus, charAndTheme) {
	let corpusTokens = rita.tokenize(corpus);
	let corpusPosTags = rita.getPosTags(corpus);
	let dictionary = {};
	let dictionaryCounter = {};
	let dictKeys;
	let alphaReg = /^[a-zA-Z]+/g;
	const themeKeys = Object.keys(charAndTheme);
	const flatThemes = flatten(
		themeKeys.map(function(key) {
			return charAndTheme[key];
		}));


	return new Promise(function(resolve, reject) {
		for (let i = 0; i < corpusTokens.length; i++) {
			dictKeys = Object.keys(dictionary);
			//Test to see if the item is a word and not punctuation or whitespace.
			if (alphaReg.test(corpusTokens[i])) {
				//Check to see if the current word is one of the themes.
				if (flatThemes.includes(corpusTokens[i])) {
					corpusPosTags[i] = themeAdder(corpusTokens[i], corpusPosTags[i]);
				}
				let thisPosTag = "<" + corpusPosTags[i] + ">";
				//Check to see if the current POS tag is already in the dictionary.
				if (dictKeys.includes(thisPosTag)) {
					//If the token already exists on the object, track its frequency on the dictionaryCounter object.
					if (dictionary[thisPosTag].includes(corpusTokens[i])) {
						freqTracker(corpusTokens[i], thisPosTag);
					}
					//Otherwise, add it to the array.
					else {
						dictionary[thisPosTag].push(corpusTokens[i]);
					}
				}
				//If the current pos tag doesn't exist on the dictionary, add it and then add an array containing the current token.
				else {
					dictionary[thisPosTag] = [corpusTokens[i]];
				}
			}
		}
		//Go through the numbers on the dictionary counter and add the frequencies to the actual dictionary.
		for (let posTag in dictionaryCounter) {
			if (dictionaryCounter.hasOwnProperty(posTag)) {
				for (let word in dictionaryCounter[posTag]) {
					if (dictionaryCounter[posTag].hasOwnProperty(word)) {
						let index = dictionary[posTag].indexOf(word);
						if (index !== -1) {
							dictionary[posTag][index] += "[" + dictionaryCounter[posTag][word].toString() + "]";
						}
					}
				}
			}
		}
		resolve(dictionary);
	});
	//This function takes a token and a posTag as args and returns a string that gives
	//the POS and theme of the current word.
	function themeAdder(token, posTag) {
		for (let key in charAndTheme) {
			if (charAndTheme.hasOwnProperty(key)) {
				if (charAndTheme[key].includes(token)) {
					return posTag + "--" + key;
				}
			}
		}
	}
	//This function takes a token and a pos tag as args and updates the data on the
	//dictionaryCounter object in order to add frequency back into the object once we're done.
	function freqTracker (token, posTag) {
		let counterKeys = Object.keys(dictionaryCounter);
		let tagKeys;
		if (counterKeys.includes(posTag)) {
			tagKeys = Object.keys(dictionaryCounter[posTag]);
			if (tagKeys.includes(token)) {
				dictionaryCounter[posTag][token] += 1;
			}
			else {
				dictionaryCounter[posTag][token] = 2;
			}
		}
		else {
			dictionaryCounter[posTag] = {};
			dictionaryCounter[posTag][token] = 2;
		}
	}
};
