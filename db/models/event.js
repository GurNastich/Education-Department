var mongoose = require('mongoose');
var Student = require('./student');

var eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: String,
	number: String,
	// groups: [{
	// 	groupType: String,
	// 	name: String
	// }],
	date: {
		type: Date,
		required: true
	},
	startTime: Date,
	endTime: Date,
	description: String,
	teachers: [String],
	admin: String,
	students: [{
		id: String,
		name: String,
		lastName: String
	}],
	materials: [{
		id: String,
		name: String
	}],
	criteria: [{
		id: String,
		name: String,
		value: Number
	}],
	studentsCount: Number,
	guestsCount: Number
});

eventSchema.statics.deleteAndFetchAll = function (id) {
	let shemaObj = this;
	return this.remove({_id : id}).exec().then(function (res) {
		return shemaObj.find();
    })
};

eventSchema.statics.getById = function (id) {
	return this.find({_id : id});
};

eventSchema.statics.updateById = function (event) {
	return this.update({_id : event._id},event);
};

var Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;