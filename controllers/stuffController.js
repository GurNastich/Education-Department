/**
 * Created by ilya on 20.11.2017.
 */
var express = require('express');

var Stuff = require('../db/models/stuff');

var Router = express.Router();

Router.get('/teachers',function (req,resp) {
    Stuff.getTeachers().then(function (result) {
        resp.json(result);
    })
});

Router.get('/admins',function (req,resp) {
    Stuff.getAdmins().then(function (result) {
        resp.json(result);
    })
});



Router.post('/',function (req,resp) {
    if(req.body.teachers){
        req.body.teachers.forEach(function (teacher) {
            Stuff.findByNameTeacher(teacher).then(function (result,err) {
               if(result !== undefined && result.length === 0){
                   new Stuff({name : teacher, type : 'teacher'}).save();
               }
               if(err){}
            });
        });
    }
    if(req.body.admin){
        Stuff.findByNameAdm(req.body.admin).then(function (result,err) {
           if(result !== undefined && result.length === 0){
               new Stuff({name : req.body.admin, type : 'admin'}).save();
           }
        });
    }
});

module.exports = Router;