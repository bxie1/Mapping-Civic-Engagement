//TODO_REPLACE all instances of MongoClient
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var path = require('path');
var config = require('./config');
var http = require('http');
var ObjectID = require('mongodb').ObjectID;

//var dbUrl = 'mongodb://localhost:27017/sse';

var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index', { title: 'Returns all'});
});


var options = {
  host: '54.174.202.171',
  port: 80,
  path: '/wp-json/wp/v2/posts/',
  method: 'GET'
};

app.get('/api/v1/', function(req,res){
//   MongoClient.connect(config.dbUrl, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     db.collection('locations').find({}).toArray(function(err, docs) {
//         res.json(docs);
//         db.close();
//     });
//   });

//Retrieve all the posts from the WordPress site
options.path = '/wp-json/wp/v2/posts/';

  http.request(options, function(resp) {
    var docs;
    resp.setEncoding('utf8');
      resp.on('data', function (chunk) {
      if (docs === undefined){
          docs = chunk;
      } else{
          docs +=chunk;
      }
      });
      resp.on('end', function(){
      var jdocs = JSON.parse(docs);
      res.json(jdocs);
      //console.log(jdocs);
      });
  }).end();
  console.log("HTTP request done.");
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
