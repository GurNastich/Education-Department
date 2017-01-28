var mongoose = require('mongoose');

var basicGroupSchema = mongoose.Schema({
	name: String,
	startDate: Date,
	endDate: Date
});

var BasicGroup = mongoose.model('BasicGroup', basicGroupSchema);

module.exports = BasicGroup;