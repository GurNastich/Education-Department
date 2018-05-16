var mongoose = require('mongoose');

var studentTypeSchema = new mongoose.Schema({
	type: String
});

var StudentType = mongoose.model('StudentType', studentTypeSchema, 'studentType');

module.exports = StudentType;