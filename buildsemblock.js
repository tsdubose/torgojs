//Returns the finished semantic block to the paragraph module.
// FIXME: Need to add in errors etc.
const workProb = require('./objectprobabilities.js');
const buildSent = require('./buildSentence.js');
const rita = require('rita');
module.exports = async function(parsedWork, semBlockLength, semBlockType) {
	let gramObj = parsedWork.sentence[semBlockType];
	let sentLength;
	let semBlock = "";
	let posTagSent;
	let grammar = rita.RiGrammar(parsedWork.dictionary);
	for (let i = 0; i < semBlockLength; i++) {
		sentLength = await workProb(gramObj);
		posTagSent = await buildSent(parsedWork, sentLength, semBlockType);
		grammar.addRule("<" + i + ">", posTagSent);
	}
for (let i = 0; i < semBlockLength; i++) {
	semBlock += grammar.expandFrom("<" + i + ">");
}
	return semBlock;
};
