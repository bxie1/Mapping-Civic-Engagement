//TODO_REPLACE all instances of MongoClient
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var path = require('path');
var config = require('./config');
var ObjectID = require('mongodb').ObjectID;

//var dbUrl = 'mongodb://localhost:27017/sse';

var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index', { title: 'Returns all'});
});

//TODO_REPLACE
app.get('/api/v1/', function(req,res){
  MongoClient.connect(config.dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.collection('locations').find({}).toArray(function(err, docs) {
        res.json(docs);
        db.close();
    });
  });
});

app.get('/api/v1/:id', function(req,res){
  var docID = ObjectID(req.params.id);
  var query = {};
  var key = '_id';
  var val = docID;
  query[key] = val;
  //TODO_REPLACE
  MongoClient.connect(config.dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log(query);
    db.collection('locations').find(query).toArray(function(err, docs) {
        res.json(docs);
        db.close();
    });
  });
});

//TODO_REPLACE. We're getting from wordpress now
app.get('/api/v1/applytags/:tag',function(req,res){
   var taglist = req.params.tag;
   taglist = taglist.split('&');
   var query = [];
   for (var i = 0; i < taglist.length; i++) {
     var tmpquery = {};
     var key = 'issueFilters.' + taglist[i];
     var val = 1;
     tmpquery[key] = val;
     query.push(tmpquery);
   }
   console.log(query);
   //TODO_REPLACE we aren't doing an explicit db lookup
   MongoClient.connect(config.dbUrl, function(err, db) {
     assert.equal(null, err);
     console.log("Apply!!");
     db.collection('locations').find({ $or: query}).toArray(function(e,docs){
       res.json(docs);
       db.close();
     });
   });
});

app.listen(config.listen)
