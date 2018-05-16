var mongoose = require('mongoose');

var Black = require('./black-list');

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
	agreementNum:String,
	numberBSO:String,
	black: Boolean,
	phones: [String],
	emails: [{
		type: String
	}],
	profileLinks: [{
		linkType: String,
		linkName: String
	}],
	type: String,
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

studentSchema.statics.updateStudent = function (student, req, resp) {
    this.findByIdAndUpdate(student._id, student, function (err, val) {
        if (err) resp.send(err);
        var checker = val._doc.black;
        if ( checker!== req.body.student.black) {
        	if(req.body.student.black === true){
                new Black({
                    stud: req.body.student._id,
                    cause: req.body.cause,
                    date: new Date()
                }).save().then((err,val) =>{if(val)resp.send(200)} );
			}
			else if(checker === true){
        		Black.findByStudent_id(req.body.student._id).then(( result) => {
        			result.outDate = new Date();
        			result.save(function (err) {
						if(err)resp.send(err);
                    });
				})
			}
			else {

			}
        }
        resp.send(200);
    });
};

studentSchema.statics.deleteAndFetchAll = function (id) {
	var shemaobj = this;
	return this.remove({_id : id}).exec().then(function (result) {
		return shemaobj.find();
    });
};

// studentSchema.statics.getByType = function (types) {
//    return this.find({'group.groupType': {$in : types}});
// };

var Student = mongoose.model('Student', studentSchema, 'student');
module.exports = Student;