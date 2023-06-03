const path = require("path");
const express = require('express');
const port = 8081;
const bcrypt = require('bcrypt');
const db = require('./db');
const app = express();
const session = require('express-session');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


app.use(cors({
    origin:[ 'http://localhost:8080', 'http://localhost:8081'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET_STRING,
    resave: false,
    saveUninitialized: false
}));


var router = express.Router();
router.post('/login',function(req,res){
    const {username , password} = req.body;
    var loginFailMessage = '不正確的帳號或密碼!';
    if(!username || !password){
        return res.json(SetResJson(false, loginFailMessage));  
    }
    db.query('SELECT * FROM `user` WHERE username = ?', [username], function(error, results, fields) {
        if (error) throw error;
        //User doesn't exist
        if (results.length < 1) return res.json(SetResJson(false, loginFailMessage));  
        //Auth
        bcrypt.compare(password, results[0]['password'], function(err, result) {
            if(!result) return res.json(SetResJson(false, loginFailMessage));  
            req.session.regenerate((err) => {
                if (err) console.error('Session regeneration error:', err);

                req.session.user = {
                    username: username,
                    isLoggedIn: true
                };

                return res.json(SetResJson(true, null));
            });
        });
    }); 
});


router.get('/check_login', function(req, res) {
    if (req.session.user && req.session.user.isLoggedIn) {
        return res.json(SetResJson(true, '使用者已登入'));
    } else {
        return res.json(SetResJson(false, '使用者未登入'));
    }
});


router.get('/logout',function(req,res){
    req.session.destroy(() => {
        return res.json(SetResJson(true, "session destroyed"));  
    })
});


app.use('/', router);

app.listen(port, function() {
    console.log('server port: ' + port);
})



/**
 * 設定回應JSON內容
 * @function SetResJson
 * @param {boolean} success - Is require success or not
 * @param {string} message - message
 * @param {string | Array | Object} data - data
 * @returns {Object}
 */
 function SetResJson(success, message = null, data = null){
    return resJson = {
        "success":success,
        "message":message,
        "data":data
    };
}
