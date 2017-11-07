var express = require('express');

var Student = require('../db/models/student.js');

var Router = express.Router();


Router.get('/',function(req,resp){
    if(req.query.id){
        var studentPromise = Student.getById(req.query.id);
        studentPromise.then(stud => resp.json(stud)).catch(err => resp.status(500));
    }
    else{
        var allStudents = Student.getAllStudents();
        allStudents.then(function (res) {
            resp.json(res);
        }).catch(function (err) {
            resp.status(err);
        });
    }
});

Router.put('/',function (req,resp) {
    var updatedStudent = Student.updateStudent(req.body.student);
    updatedStudent.then(function (stud) {
        resp.send(200)
    }).catch(function (err) {
        resp.send(err)
    });
});

Router.delete('/',function (req,resp) {
    if(req.query.id){
        var deletedPr = Student.deleteAndFetchAll(req.query.id);
        deletedPr.then(function (students) {
            resp.json(students);
        }).catch(function (err) {
            resp.send(err);
        })
    }
});

module.exports = Router;