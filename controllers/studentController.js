var express = require('express');

var Student = require('../db/models/student.js');

var Router = express.Router();


Router.get('/',function(req,resp){
    if(req.query.id){
        let studentPromise = Student.getById(req.query.id);
        studentPromise.then(stud => resp.json(stud)).catch(err => resp.status(500));
    }
    else if(req.query.types){
        let studentType = Student.getByType(req.query.types);
        studentType.then(stud => resp.json(stud)).catch(function (err) {
            resp.status(500);
        })
    }
    else{
        let allStudents = Student.getAllStudents();
        allStudents.then(function (res) {
            resp.json(res);
        }).catch(function (err) {
            resp.status(err);
        });
    }
});

Router.put('/',function (req,resp) {
    let updatedStudent = Student.updateStudent(req.body.student);
    updatedStudent.then(function (stud) {
        resp.send(200)
    }).catch(function (err) {
        resp.send(err)
    });
});

Router.delete('/',function (req,resp) {
    if(req.query.id){
        let deletedPr = Student.deleteAndFetchAll(req.query.id);
        deletedPr.then(function (students) {
            resp.json(students);
        }).catch(function (err) {
            resp.send(err);
        })
    }
});

Router.post('/',function (req,resp) {
    new Student(req.body.student).save(function(err, student) {
        resp.json(student);
    });
});

module.exports = Router;