const express = require('express');
const port = 8081;
var app = express();
var db = require('./db');
var session = require('express-session')

var router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.post('/login',function(req,res){
    //auth
});

app.use('/', router);

app.listen(port, function() {
    console.log('server port: ' + port);
})


