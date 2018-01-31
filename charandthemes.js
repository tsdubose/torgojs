const rita = require('rita');
const wordnet = require('node-wordnet');

const myNet = new wordnet();
/*Given a string, this module returns an object of the three primary characters of a work (defined by numbers of mentions) and the primary themes—a net of nouns that are commonly mentioned and related to one another via a wordnet lookup.
The returned object takes the following form:
{
char1: first char,
char2: second char,
char3: third char,
theme1: [array of themes],
theme2: [array of themes],
theme3: [array of themes]
}
["char1", "char2", "char3"],
[any number of strings as found by wordnet],
[any number of strings as found by wordnet],
[any number of strings as found by wordnet]


This whole thing returns a Promise.
*/
// TODO: need to implement promise.settle in appropriate places.
// TODO: need to account for a lower number of themes being returned.
// TODO: need to add other pointers.
// TODO: similar to the promise.settle issue above, need to give this the ability to keep going if things aren't found.
// TODO: Need to solve the 'I' problem
// IDEA: There's really no reason to limit this to three characters. Could even bring in key places.

//Function called by the exported function in order to actually find the main characters. Expects the sorted concordance array as input and returns a promise containing an array of the three names.
//IDEA: TF-IDF probably changes a lot of this, god damn it.
function characterFinder(sortedArray) {
	return new Promise(function(resolve, reject) {
		var topThree = [];
		//Look through the keys of the objects in the array. If one is a proper noun, push it into the topThree array. When you have three of those, break out of the loop and resolve the promise with the array. I'm using a for loop because I don't expect to make it all the way through.
		for (let i = 0; i < sortedArray.length; i++) {
			if (rita.getPosTags(Object.keys(sortedArray[i])[0])[0] == 'nnp' ||
					rita.getPosTags(Object.keys(sortedArray[i])[0])[0] == 'nnps' ) {
				topThree.push(Object.keys(sortedArray[i])[0]);
			}
			if (topThree.length == 3) {
				resolve(topThree);
				break;
			}
		}
		reject(new Error("Unable to find the top three character names from the text."));
	});
}

//Function called to find the themes of the work. Expects the sorted concordance array as input and returns a promise containing an array with three arrays inside, each of which contain the strings of the most common themes. I need to actually count how many hits there are for a particular set of themes.
function themeFinder(sortedArray) {
	return new Promise(function(resolve, reject) {
		let themes = [];
		let vocabGatherer = [];
		let currentWord;
//Get the three most common nouns in the series.
		for (let i = 0; i < sortedArray.length; i++) {
			currentWord = Object.keys(sortedArray[i])[0];
			if (rita.getPosTags(currentWord)[0] == 'nn' ||
					rita.getPosTags(currentWord)[0] == 'nns' ) {
				vocabGatherer.push(currentWord);
			}
			if (vocabGatherer.length == 3) {
				break;
			}
		}
		//Look up the words in WordNet
		let vocabProms = [myNet.lookupAsync(vocabGatherer[0]), myNet.lookupAsync(vocabGatherer[1]), myNet.lookupAsync(vocabGatherer[2])];
		//Once they're all found, grab the most common word object out of them. The map function catches anything that rejects and makes it null.
		Promise.all(vocabProms.map(p => p.catch(() => null)))
			.then((lookupResults) => {
				let wordObjects = lookupResults.map(function (el) {
					if (el) {
						for (let i = el.length - 1; i > 0; i--) {
							if (el[i].pos == "n") {
								return el[i];
							}
						}
					}
				});
				return wordObjects;
			})
			//After you find the most common word objects, pull the synonyms out of them and then send on the pointers.
			.then((wordObjects) => {
				return Promise.all(wordObjects.map(function (el) {
					themes.push(el.synonyms);
					return Promise.all(el.ptrs.map(function (pointer) {
						if (pointer.pos == "n" && pointer.pointerSymbol == "@") {
							return myNet.getAsync(pointer.synsetOffset, pointer.pos);
						}
						else {
							return null;
						}
					}));
				})
				);
			})
			//Push the synonyms from the pointers into their correct spot on the themes array.
			.then((pointers) => {
				pointers.forEach(function (foundPointers, pointerIndex) {
					foundPointers.forEach(function (pointerObject) {
						if (pointerObject) {
							pointerObject.synonyms.forEach(function (synonym) {
								if (themes[pointerIndex].indexOf(synonym) == -1) {
									themes[pointerIndex].push(synonym);
								}
							});
						}
					});
				});
				resolve(themes);
			})
			.catch((error) => reject(error));
	});
}
//You have to run this in order to avoid the async issue cropping up when trying to look up the pointers. This is not at all finished.

module.exports = function (corpus) {
	//create the concordance from the given corpus. Will probably need to rethink some of these options, especially if case becomes an issue. Currently ignoring honorifics. Going to need to do some regex magic in order to get the
	const concord = rita.concordance(corpus, {
		ignoreStopWords: true,
		wordsToIgnore: ["he", "him", "his", "her", "she", "hers", "they", "them", "their", "theirs", "in", "from", "Mr", "Mrs", "Ms", "Miss", "Dr", "“I"],
		ignoreCase: false,
		ignorePunctuation: true
	});


	//Turn the concordance into an array of word/incidence number paired objects and sort them.
	var concordArray = [];
	for (var key in concord) {
		if (concord.hasOwnProperty(key)) {
			concordArray.push({[key]: concord[key]});
		}
	}
	concordArray.sort(function (a, b) {
		var keyNameA = Object.keys(a)[0];
		var keyNameB = Object.keys(b)[0];

		return  b[keyNameB] - a[keyNameA];
	});

	//Take the sorted concordance and pass it to each of the functions created above. Then Promise.all will wait for a response.
	return new Promise(function(resolve, reject) {
		let themeAndChar = [characterFinder(concordArray), themeFinder(concordArray)];
		Promise.all(themeAndChar)
			.then((resolvedThemeAndChar) => {
				// Switching this from an array to an object. There's more work to be done here to make this less hard-wired.
				let themeAndCharToReturn = {};
				themeAndCharToReturn.char1 = resolvedThemeAndChar[0][0];
				themeAndCharToReturn.char2 = resolvedThemeAndChar[0][1];
				themeAndCharToReturn.char3 = resolvedThemeAndChar[0][2];
				themeAndCharToReturn.theme1 = resolvedThemeAndChar[1][0];
				themeAndCharToReturn.theme2 = resolvedThemeAndChar[1][1];
				themeAndCharToReturn.theme3 = resolvedThemeAndChar[1][2];
				resolve(themeAndCharToReturn);
			}
			)
			.catch((error) => reject(error));
	});
};
