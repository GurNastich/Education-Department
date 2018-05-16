var mongoose = require('mongoose');

var lessonTypeSchema = new mongoose.Schema({
	type: String,
	name: String,
	shortName: String
});

var LessonType = mongoose.model('LessonType', lessonTypeSchema, 'lessonType');

module.exports = LessonType;