const charAndTheme = require('./charandthemes.js');
const objectParse = require('./objectparser.js');
const parseGram = require('./grammarparser.js');
const fs = require('fs-extra');
const cleanCorpus = require('./cleancorpus.js');
const createDict = require('./createdictionary.js');

module.exports = {
	//The parse function takes a single file and returns with its structure.
	parse: function (pathToFile) {
		if (typeof pathToFile !== "string") {
			throw new Error(pathToFile + " is not a valid filename.");
		}

		return new Promise(function(resolve, reject) {
			fs.readFile(pathToFile, 'utf-8')
			.then(text => objectParse(text))
			.then((textArray) => {
				//The final item of the array that's returned contains the raw text. Shave it off before sending the chapters on.
				let chapters = textArray.slice(0, textArray.length - 1);
				return Promise.all([Promise.resolve(chapters), charAndTheme(textArray[textArray.length -1])]);
			})
			.then(charAndChap => parseGram(charAndChap[1], charAndChap[0]))
			.then(parsedWork => resolve(parsedWork))
			.catch(e => reject(e));
		});
	},

	createDictionary: function (pathToFile) {
		if (typeof pathToFile !== "string") {
			throw new Error(pathToFile + " is not a valid filename.");
		}

		return new Promise(function(resolve, reject) {
			fs.readFile(pathToFile, 'utf-8')
			.then(corpus => cleanCorpus(corpus))
			.then((cleanedCorpus) => {
				return Promise.all([Promise.resolve(cleanedCorpus), charAndTheme(cleanedCorpus)]);
			})
			.then(corpusAndTheme => createDict(corpusAndTheme[0], corpusAndTheme[1]))
			.then(dictionary => {
				resolve(dictionary);
			})
			.catch(e => {
				reject(e);
			})
		});
	}
};
