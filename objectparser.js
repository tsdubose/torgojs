/* This function takes in a file (assumes a text file at the moment) and returns an array that splits the file into distinct chapters and paragraphs.

The returned file takes the form [[chapter[para, para, para]]]. The final item of the array is a string of the raw text that's been returned.

Expects a text file as input and returns a promise that resolves as the structure seen above.

I'm not chopping into sentences here: since I'm dealing with the sentence-level elsewhere, and I have dialogue to worry about, I'm just going to sort that out then.

TODO: I need to accept eBook input. This seems like a logical place to sort that out, probably by slicing off the file extension and examining it.
TODO: Need a better reason to reject. For example, need to test if it's getting text input.
*/
const smarten = require('./smarten.js');
module.exports = function (text) {
	return new Promise(function(resolve, reject) {
		//Be sure the text is using curly quotes and is otherwise clean.
		let smartenedText = smarten(text);
		//Split the text into chapters. Delete the short chapter titles that get caught up in this.
		let chapters = smartenedText.split(/\n\s*\n\s*\n/).filter(function (item) {
			return item.length > 500;
		})
		//Split the chapters into paragraphs
			.map(function (chapter) {
				return chapter.split(/\n\s*\n/);
			});
		let cleanedText = smartenedText.replace(/\r?\n|\r/g, " ");

		chapters.push(cleanedText);

		if (!chapters) {
			reject("Could not sort the text into paragraphs and chapters.");
		}
		resolve(chapters);
	});
};
