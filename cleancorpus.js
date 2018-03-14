/*This module accepts raw text as an input, and then takes out extraneous line breaks and
converts all quotes to smart quotes etc.*/
const smarten = require('./smarten.js');
module.exports = function (rawText) {
	let smartenedText = smarten(rawText)
	.replace(/\\n/g, /\[ ]/);
	return new Promise(function(resolve) {
		resolve(smartenedText);
	});
};
