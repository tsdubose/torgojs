//Takes the work object (need a better name for that) and the number of paragraphs in the current chapter
//as arguments and returns the chapter when it's finished.
// TODO: Right now this entire thing is failing if a single paragraph fails to parse. That's not good.
const workProbs = require('./objectprobabilities.js');
const buildPara = require('./buildpara.js');

module.exports = async function (parsedWork, chapLength) {
	let chapter = "";
	let paraLength;
	for (let i = 0; i < chapLength; i++) {
		paraLength = parseInt(await workProbs(parsedWork.paragraph), 10);
		if (typeof paraLength !== "number") {
			throw new Error("Error calculating paragraph length.");
		}
		chapter += await buildPara(parsedWork, paraLength);
	}
	return chapter;
};
