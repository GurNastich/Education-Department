var mongoose = require('mongoose');
var Student = require('./student');

var eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	// type: {
	// 	type: String,
	// 	required: true
	// },
	groups: [{
		groupType: String,
		name: String
	}],
	date: {
		type: Date,
		required: true
	},
	startTime: Date,
	endTime: Date,
	description: String,
	teachers: [String],
	admin: String,
	//students: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
	students: [{
		id: String,
		name: String,
		lastName: String
	}]
	// students: [Student.studentSchema],	//from edx course
	// marks: [{name: String, value: Number}]	//mixed
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;