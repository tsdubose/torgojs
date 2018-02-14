/*Expects, as input, an array of parts of speech tags and an object that it will
update to sort the parts of speech data. Yes, it's mutating data, and it's not
good functional design, but I'm not really concerned at the moment.

Note that the object it accepts is not the entire grammar object from the
sentence parser module: it is only the data for that sentence length.

Then, it cycles through the POS tags and adds a grammar structure to that
sentence length.

TODO: This and the array counter module have a lot of overlap. I need to
figure out how to combine them.
TODO: Punctuation is just going to fuck this thing right up, I think. Maybe I need
to think a bit more in terms of sentence types and then add punctuation that way.
*/
module.exports = function(posTags, grammarObject) {
	//Looping through the array, starting at
	for (let i = 0; i < posTags.length; i++) {
		//If we're at the end, stop running the loop in order to prevent periods from
		//jamming up the data structures.
		if (i == (posTags.length - 1)) {
			break;
		}

		if (i == 0) {
			grammarObject.starts = sortKeys(i, grammarObject.starts, posTags);
		}

		else {
			grammarObject = sortKeys(i, grammarObject, posTags);
		}

	}

	return grammarObject;

};
//A function that actually does the math on the parts of speech and puts them
//in the correct places. Takes the index from the for loop above as arg1, the object
//that's being worked on as arg2, and the array of POS tags as arg3. Note that this function
//is agnostic as regards working on the list of starting tags or the body of the sentence itself.

// IDEA: Might work better as a setter, but I'm not going to worry about that right now;
//it's an easyish change to make later.
function sortKeys(index, objectToSort, posTags) {
	//Get the object's keys in an array, so we can check whether the POS is on the object.
	const keys = Object.keys(objectToSort);
	//Check to see if the keys include the current POS.
	if (keys.includes(posTags[index])) {
		//If the POS already exists on the object, get an array of the POSes that have been shown to follow it.
		const followingKeys = Object.keys(objectToSort[posTags[index]].following);
		//Increase the current POS's total hits by 1.
		objectToSort[posTags[index]].total += 1;
		//Check to see if the next POS in the array exists on the object. If it doesn't, add it.
		if (!followingKeys.includes(posTags[index + 1])) {
			objectToSort[posTags[index]].following[posTags[index + 1]] = 1;
		}
		//Otherwise, increase its value by 1.
		else {
			objectToSort[posTags[index]].following[posTags[index + 1]] += 1;
		}
	}
	// If the current POS doesn't exist in the array of keys, add it and create an
	// object for the following POSes.
	else {
		objectToSort[posTags[index]] = {};
		objectToSort[posTags[index]].total = 1;
		objectToSort[posTags[index]].following = {};
		objectToSort[posTags[index]].following[posTags[index + 1]] = 1;
	}

	return objectToSort;
}
