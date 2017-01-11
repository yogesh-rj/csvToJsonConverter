var express = require('express');
var app = express();
var main = require('./main.js');

app.get('/convertToJson',main.convertToJson);

var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("app listening at port:%s",port)
});