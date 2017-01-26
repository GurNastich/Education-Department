var mongoose = require('mongoose');
var studentSchema = mongoose.Schema({
	name: String,
	lastName: String,
	patronymic: String,
	group: String,
	stream: String,
	phone: String,
	email: String
});

studentSchema.methods.getTableName = function() {
	return this.name + ' ' + this.lastName;
};

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;