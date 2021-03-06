
var assert = require('assert');
var express = require('express');
var path = require('path');
var config = require('./config');
var http = require('http');


var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index', { title: 'Returns all'});
});


var options = {
  host: config.wpSite,
  port: 80,
  path: '/wp-json/wp/v2/posts/',
  method: 'GET'
};

app.get('/api/v1/', function(req,res){

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
      try{
        var jdocs = JSON.parse(docs);
        res.json(jdocs);
      }
      catch(e){
        console.log("JSON parse error main site.");
        res.json("");
      }
      
    });
  }).end();
  
  console.log("HTTP request done.");
});

app.get('/api/v1/search/:keywords',function(req,res){
  var keywords = req.params.keywords;
  keywords = keywords.replace(/ /g,"%20");
  //Retrieve posts from the WordPress site
  keywords = "search=" + keywords
  options.path = '/wp-json/wp/v2/posts?'+keywords;
  
  
  console.log("Search! Path: " + options.path);
  
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
        try{
          var jdocs = JSON.parse(docs);
          res.json(jdocs);
          }
          catch(e){
            console.log("JSON parse Error for search.");
            res.json("");
          }
      });
  }).end();
  console.log("HTTP request done for search.");
});


app.get('/api/v1/applytags/:tag',function(req,res){
  var taglist = req.params.tag;
  taglist = taglist.replace(/ /g,"%20");
   
  //Retrieve posts from the WordPress site
  options.path = '/wp-json/wp/v2/posts?filter[category_name]='+taglist;
  console.log("APPLY!! Path: " + options.path);
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
          try{
          var jdocs = JSON.parse(docs);
          res.json(jdocs);
          }
          catch(e){
            console.log("JSON parse error for categories.");
            res.json("");
          }
      });
  }).end();
  console.log("HTTP request done for apply tags.");
});

app.listen(config.listen)
