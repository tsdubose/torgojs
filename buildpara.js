//Builds the semantic blocks inside the paragraphs.
const workProbs = require('./objectprobabilities.js');
const buildSemBlock = require('./buildsemblock.js');

module.exports = async function (parsedWork, paraLength) {
	let para = "";
	let semBlockType;
	let followingBlockType;
	let semBlockLength;
	for (let i = 0; i < paraLength; i++) {
		//If we're on the first iteration of the loop, set the initial values.
		if (i == 0) {
			semBlockType = await workProbs(parsedWork.paragraph[paraLength].starts);
			followingBlockType = await workProbs(parsedWork.paragraph[paraLength].starts[semBlockType].following);
		}

		else {
			semBlockType = followingBlockType;
			followingBlockType = await workProbs(parsedWork.paragraph[paraLength][semBlockType].following);
		}
		semBlockLength = await workProbs(parsedWork.semBlock);
		para +=  await buildSemBlock(parsedWork, semBlockLength, semBlockType);
	}
	return para + "\r\n";
};
