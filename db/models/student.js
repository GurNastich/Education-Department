var mongoose = require('mongoose');
var Event = require('./event');
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
		groupName: String
	},
	transitions: {
		toBaseGroup: Date,
		toYoungGroup: Date,
		toMainGroup: Date
	}
	// visits: [Event.eventSchema]
});
// var studentSchema = new mongoose.Schema({
// 	name: {
// 		type: String,
// 		requirde: true
// 	},
// 	lastName:  {
// 		type: String,
// 		requirde: true
// 	},
// 	patronymic: String,
// 	phones: [String],
// 	emails: {
//     	type: [String],
//     	// required: true,
//     	match: /.+@.+\..+/,
//     	lowercase: true
//   	},
//   	profileLinks: [{type: String, link: String}],	//mixed
// 	startDate: Date,
// 	group: String,
// 	transitions: {	//mixed
// 		toBase: Date,
// 		toYoungGroup: Date,
// 		toMainGroup: Date 
// 	},
// 	// visits: [{date: Date, group: String}],	//maybe it is possible to go without visits array, fetch by lesson
// 	introLections: Boolean,
// 	introLectionDate: Date
// 	// prestudent: Boolean,
// 	// introMonth: month when student came to introduction 
// });

// studentSchema.methods.getTableName = function() {
// 	return this.name + ' ' + this.lastName;
// };

var Student = mongoose.model('Student', studentSchema, 'students');
module.exports = Student;