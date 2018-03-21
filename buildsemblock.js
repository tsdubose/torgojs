//Returns the finished semantic block to the paragraph module.
// FIXME: Need to add in errors etc.
const workProb = require('./objectprobabilities.js');
const buildSent = require('./buildSentence.js');
module.exports = async function(parsedWork, semBlockLength, semBlockType) {
	let gramObj = parsedWork.sentence[semBlockType];
	let sentLength;
	let semBlock = "";
	for (let i = 0; i < semBlockLength; i++) {
		sentLength = await workProb(gramObj);

		semBlock += await buildSent(parsedWork, sentLength, semBlockType);
	}

	return "semBlock length is " + semBlockLength + " " + semBlock;
};
