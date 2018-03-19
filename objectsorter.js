/*Expects, as input, an array of items to sort and an object that it will
update to sort the pieces into. It is agnostic as to whether what it's sorting is semantic blocks or parts of speech.

Note that the object it accepts is not the entire object from the
sentence parser module: it is only the data for that item length.

Then, it cycles through the items and adds a structure to that length.
*/
module.exports = function(p, o) {
	for (let i = 0; i < p.length; i++) {

		if (i == 0) {
			o.starts = sortKeys(i, o.starts, p);
		}
		else {
			o = sortKeys(i, o, p);
		}
	}
	return o;

};
//A function that actually does the math on the parts of speech and puts them
//in the correct places. Takes the index from the for loop above as arg1, the object
//that's being worked on as arg2, and the array of POS tags as arg3. Note that this function
//is agnostic as regards working on the list of starting tags or the body of the sentence itself.

// IDEA: Might work better as a setter, but I'm not going to worry about that right now;
//it's an easyish change to make later.
function sortKeys(index, objectToSort, p) {
	//Get the object's keys in an array, so we can check whether the current item is on the object.
	const keys = Object.keys(objectToSort);
	//Check to see if the keys include the current item.
	if (keys.includes(p[index])) {
		//If the item already exists on the object, get an array of the items that have been shown to follow it.
		const followingKeys = Object.keys(objectToSort[p[index]].following);
		//Increase the current item's total hits by 1.
		objectToSort[p[index]].total += 1;
		//Check to see if we're at the end of the array before performing the following increments.
		if (p[index + 1]) {
			//Check to see if the next item in the array exists on the object. If it doesn't, add it.
			if (!followingKeys.includes(p[index + 1])) {
				objectToSort[p[index]].following[p[index + 1]] = 1;
			}
			//Otherwise, increase its value by 1.
			else {
				objectToSort[p[index]].following[p[index + 1]] += 1;
			}
		}
	}
	// If the current POS doesn't exist in the array of keys, add it and create an
	// object for the following POSes.
	else {
		objectToSort[p[index]] = {};
		objectToSort[p[index]].total = 1;
		objectToSort[p[index]].following = {};
		if (p[index + 1]) {
			objectToSort[p[index]].following[p[index + 1]] = 1;
		}

	}

	return objectToSort;
}
