var mongoose = require("mongoose");

//schema Setup
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectID,
			ref:"User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment",commentSchema);