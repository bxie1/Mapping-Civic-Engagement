var mongo = require('mongodb');
var express = require('express');
var path = require('path');
var db =  monk('localhost:27017/locations');

var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index', { title: 'Swat Social Enterprise'});
});

app.listen(3000)
