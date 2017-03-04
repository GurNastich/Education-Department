var mongoose = require('mongoose');
var Student = require('./student');

var eventSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	startTime: Date,
	endTime: Date,
	description: String,
	teachers: [String],
	administrators: [String],
	// students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
	students: [{ type: mongoose.Schema.Types.ObjectId }]	//from edX course
	// students: [Student.studentSchema],	//from edx course
	// marks: [{name: String, value: Number}]	//mixed
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;