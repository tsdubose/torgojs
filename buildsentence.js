const rita = require('rita');
const workProb = require('./objectprobabilities.js');

module.exports = async function(parsedWork, sentLength, semBlockType) {
	let posTagSent = "";
	let gramObj = parsedWork.sentence[semBlockType][sentLength];
	let posTag, followingPosTag;

	for (let i = 0; i < sentLength; i++) {
		if (i == 0) {
			posTag = await workProb(gramObj.starts);
			followingPosTag = await workProb(gramObj.starts[posTag].following);
		}

		else {
			//If there is a following posTag, use it. Otherwise, just recalculate based on the structure of the sentence.
			posTag = followingPosTag ? followingPosTag : await workProb(gramObj);
			if (gramObj[posTag].following) {
				followingPosTag = await workProb(gramObj[posTag].following);
			}

		}
		// posTagSent.push("<" + posTag + ">");
		posTagSent += "<" + posTag + "> ";
	}
	parsedWork.dictionary.addRule("<start>", posTagSent);
	// TODO: Need to capitalize sentences, add quotation marks etc.
	return "sentence length is " + sentLength + " " + parsedWork.dictionary.expand() + " ";
};
