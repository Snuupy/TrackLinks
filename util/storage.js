var currentID = 0;
var db = {};

// db will look like:
// {
// 	1: [10, 11, 12],
//	2: [1]
// }


var storage = {

	createID: function() {
		db[++currentID] = [];
		return currentID;
	},
	getUserLog: function(userid) {
		console.log(db[userid]);
		if (db[userid]) {
			return db[userid];
		} else {
			throw Error("Invalid URL");
		}
	},
	log: function(userid, trackingData) {
		if (db[userid]) {
			db[userid].push(trackingData);
		} else {
			throw Error("Invalid URL");
		}
	}
}


module.exports = storage;


// Yes, I could/should use a database. This is a proof of concept, go away.