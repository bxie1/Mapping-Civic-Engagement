var express = require('express'),
    path = require('path'),
    jade = require('jade'),
    config = require('./config'),
    http = require('http');

// var server = http.createServer(function(req, res) {
//   res.writeHead(200);
//   res.end('Hello Http\n');
// });

var options = {
  host: '54.174.202.171',
  port: 80,
  path: '/wp-json/wp/v2/posts/',
  method: 'GET'
};



var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){

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
      res.render('allPosts', {posts:jdocs, title: "All WordPress Posts"});
      //console.log(jdocs);
      });
  }).end();
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});