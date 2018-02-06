/**
 * Created by ilya on 19.11.2017.
 */
var mongoose = require('mongoose');

var stuffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: String
});

stuffSchema.statics.findByStud_id = function (name) {
  return this.find({name : name})
};

stuffSchema.statics.findByNameAdm = function (name) {
    return this.find({name : name, type : 'admin'})
};

stuffSchema.statics.findByNameTeacher = function (name) {
    return this.find({name : name, type : 'teacher'})
};
stuffSchema.statics.getTeachers = function () {
  return this.find({type : 'teacher'})
};

stuffSchema.statics.getAdmins = function () {
    return this.find({type : 'admin'})
};

var Stuff = mongoose.model('Stuff',stuffSchema,'stuff');

module.exports = Stuff;