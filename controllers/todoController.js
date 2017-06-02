var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database
mongoose.Promise = global.Promise;﻿
mongoose.connect("mongodb://test:test@ds161931.mlab.com:61931/todo");

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

//create schema - this is like a blueprint
var todoSchema = new Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data=[{item:'get milk'}, {item: 'walk dog'},{item:'order groceries'}];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){
  app.get('/',function(req,res){
    //get data from mongodb and pass it to the view
    Todo.find({},function(err,data){
      if (err) throw err;
      res.render('todo',{todos:data});
    });

  });

  app.post('/',urlencodedParser, function(req,res){
    //get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item',function(req,res){
    //delete the requested item from mongodb
    Todo.find({item:req.params.item.replace(/\-/g," ")}).remove(function(err,data){
      if(err) throw err;
      res.json(data);
    });
  });
};
