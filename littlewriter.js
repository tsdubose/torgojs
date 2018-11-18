const workProbs = require('./objectprobabilities.js');
const buildChap = require('./buildchap.js');
process.on('message', async function (parsedWork) {
	let chapLength = parseInt(await workProbs(parsedWork.chapter.chLength), 10);
	let chapter = await buildChap(parsedWork, chapLength);
	process.send(chapter);
	return null;
});
