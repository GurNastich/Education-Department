var mongoose = require('mongoose');

var groupTypeSchema = new mongoose.Schema({
	type: String,
	name: String,
	shortName: String
});

var GroupType = mongoose.model('GroupType', groupTypeSchema);

module.exports = GroupType;