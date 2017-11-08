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

studentSchema.statics.getById = function (id) {
  return this.find({'_id': id});
};

studentSchema.statics.getAllStudents = function () {
	return this.find();
};

studentSchema.statics.updateStudent = function (student) {
return this.update({_id : student._id},student);
};

studentSchema.statics.deleteAndFetchAll = function (id) {
	var shemaobj = this;
	return this.remove({_id : id}).exec().then(function (result) {
		return shemaobj.find();
    });
};

studentSchema.statics.getByType = function (types) {
    this.find({'group.groupType': {$in : types}});
};

var Student = mongoose.model('Student', studentSchema, 'students');
module.exports = Student;