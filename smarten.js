/*Replaces straight quotes with curly and otherwise cleans up text.*/
module.exports = function (a) {
	a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1‘");       // opening singles
	a = a.replace(/'/g, "’");                            // closing singles & apostrophes
	a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1“"); // opening doubles
	a = a.replace(/"/g, "”");                           // closing doubles
	a = a.replace(/--/g, "—");                // em-dashes
	a = a.replace(/_(?=\w)|(?=\w)_/g, "");                     //Underscores Gutengberg puts in.
	return a;
};
