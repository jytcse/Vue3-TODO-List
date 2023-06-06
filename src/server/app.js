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
    //If username or password is empty
    if(!username || !password) return res.json(SetResJson(false, loginFailMessage));
    //Get user's data from database
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
                    userId: results[0]['ID'],
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

router.get('/myList/:year/:month/:day',function(req,res){
    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401);
        return res.json(SetResJson(false, '權限不足'));
    }
    
    db.query('SELECT `Date` ,`Name`,`Content`,`Status`, `node`.`ID` AS `Node-ID` ,`user`.`ID` AS `User-ID` FROM `user` INNER JOIN `todo-list` AS `list` ON `user`.`ID` = `list`.`User-ID` INNER JOIN `list-node` AS `node` ON `list`.`ID` = `node`.`List-ID` WHERE `user`.`ID` = ? AND `list`.`Date` = ?', [req.session.user.userId,`${req.params.year}-${req.params.month}-${req.params.day}`], function(error, results, fields) {
        if (error) throw error;
        if (results.length < 1){
            return res.json(SetResJson(true, "查無資料", null));
        }
        //時間處理
        results = results.map(item => {
            const date = new Date(item.Date);
            const formattedDate = date.toISOString().split('T')[0];
            return { ...item, Date: formattedDate };
        });
        // console.log(results);
        res.json(SetResJson(true,null,results));  
    }); 
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
