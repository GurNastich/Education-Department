var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
	name: {
		type: String,
		requirde: true
	},
	lastName:  {
		type: String,
		requirde: true
	},
	patronymic: String,
	phones: [String],
	emails: [{
		type: String,
		match: /.+@.+\..+/,
		lowercase: true
	}],
	profileLinks: [{
		linkType: String,
		linkName: String
	}],
	group: {
		groupType: String,
		name: String
	},
	introLectionDate: Date,
	transitions: {
		toIntroGroup: Date,
		toBaseGroup: Date,
		toYoungGroup: Date,
		toMainGroup: Date
	},
	note: String
});

var Student = mongoose.model('Student', studentSchema, 'students');
module.exports = Student;