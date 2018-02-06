
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blackShema = new mongoose.Schema({
    stud: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    cause: String,
    date : Date,

    outDate: Date
});

blackShema.statics.findByStudent_id = function (id) {
    return this.findOne({stud : id});
};

blackShema.statics.findAllPopulate = function () {
    return this.find().populate('stud');
};

blackShema.statics.outdate = function (stud) {
    this.findOne({stud: stud._id},(err,res) => {
        res.outDate = new Date();
        res.save();
    })
};



var Black = mongoose.model('Black',blackShema,'blackList');

module.exports = Black;