const express = require('express');
const port = 8081;
var app = express();
var db = require('./db');
var session = require('express-session')
var cors = require('cors');

app.use(cors())
app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bcrypt = require('bcrypt');
const saltRounds = 12;

var router = express.Router();
router.post('/login',function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    var resJson = {
        "success":true,
        "message":"",
        "data":""
    };
    var loginFailMessage = "不正確的帳號或密碼!";
    //auth
    if(username && password){
        db.query('SELECT * FROM `user` WHERE username = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0)
            {
                bcrypt.compare(password, results[0]['password'], function(err, result) {
                    if(result == true){
                        req.session.loggedin = true;
				        req.session.username = username;
                        req.session.save();
                        res.json(resJson);
                        
                    }
                    else{
                        resJson["success"] = false;
                        resJson["message"] = loginFailMessage;
                        res.json(resJson)
                    }
                });
            }else{
                resJson["success"] = false;
                resJson["message"] = loginFailMessage;
                res.json(resJson)
            }

            // Authenticate the user
            // req.session.loggedin = true;
            // req.session.username = username;
            // Redirect to home page
            // res.redirect('/home');
			// res.end();
		});
    }
});

app.use('/', router);

app.listen(port, function() {
    console.log('server port: ' + port);
})


