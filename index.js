const rita = require('rita');
const fs = require('fs');
const tracery = require('tracery-grammar');
var cleanedNames = [];
var charCounts = {};
fs.readFile('pridesub.txt', 'utf-8', function (err, data) {
	if (err) {
		throw err;
	}

	var regex = /\b((?:[A-Z][a-z][-A-Za-z']*(?: *[A-Z][a-z][-A-Za-z']*)*)\b|\b(?:[A-Z][a-z][-A-Za-z']*))\b/g;
	var names = data.match(regex);
	names.forEach(function (value, index, array) {
		var tag = rita.getPosTags(value);
		if (tag[0] === 'nnp' || tag[0] === 'nnps') {
			if (value === 'Mr' || value === 'Mrs' || value === 'Miss' || value === 'Lady') {
				cleanedNames.push(value + " " + array[index + 1]);
				array.splice(index + 1, 1);
			}
			else {
				cleanedNames.push(value);
				}
			}
			});
			cleanedNames.forEach(function (val, ind, arr) {
				if (charCounts[val]) {
					charCounts[val]++;
				}
				else {
					charCounts[val] = 1;
				}
			});
			var myString = JSON.stringify(charCounts, null, 1);
			fs.writeFile('tags.txt', myString, function (err) {
				if (err) {
					throw err;
				}
			});
	});
