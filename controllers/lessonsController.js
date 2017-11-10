var express = require('express');

var Event = require('../db/models/event.js');

var Router = express.Router();


Router.get('/',function (req,resp) {
    if(req.query.id){
        let eventPromise = Event.getById(req.query.id);
        eventPromise.then(event => resp.json(event)).catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
    }
    else{
        Event.find(function(err, lessons) {
            if(err) resp.send(500);
            resp.json(lessons);
        });
    }
});

Router.put('/',function (req,resp) {
   if(req.body.lesson){
       let updatedEvent = Event.updateById(req.body.lesson);
       updatedEvent.then(ev => resp.send(200))
   }
});

Router.post('/',function (req,resp) {
   if(req.body.lesson){
       new Event(req.body.lesson).save(function(err, lesson) {
           resp.json(lesson);
       });
   }
   else{
       resp.sendStatus(500);
   }
});

Router.delete('/',function (req,resp) {
   if(req.query.id){
       let allEventsProm = Event.deleteAndFetchAll(req.query.id);
       allEventsProm.then(events => resp.json(events)).catch(err => {
           console.log(err);
           resp.sendStatus(500);})
   }
   else{
       resp.sendStatus(500);
   }
});

module.exports = Router;