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
    origin: ["http://localhost:8080","http://localhost:8081","http://127.0.0.1:8080"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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

router.post('/login', function (req, res) {
    const { username, password } = req.body;
    var loginFailMessage = '不正確的帳號或密碼!';
    //If username or password is empty
    if (!username || !password) return res.json(SetResJson(false, loginFailMessage));
    //Get user's data from database
    db.query('SELECT * FROM `user` WHERE username = ?', [username], function (error, results, fields) {
        if (error) throw error;
        //User doesn't exist
        if (results.length < 1) return res.json(SetResJson(false, loginFailMessage));
        //Auth
        bcrypt.compare(password, results[0]['password'], function (err, result) {
            if (!result) return res.json(SetResJson(false, loginFailMessage));
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


router.get('/check_login', function (req, res) {
    if (req.session.user != null && req.session.user && req.session.user.isLoggedIn) {
        return res.json(SetResJson(true, '使用者已登入'));
    } else {
        return res.json(SetResJson(false, '使用者未登入'));
    }
});


router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        return res.json(SetResJson(true, "session destroyed"));
    })
});

router.get('/myList/:year/:month/:day', function (req, res) {
    //檢查訪問權限
    if (req.session.user == null) return res.json(SetResJson(false, "未登入", null));
    CheckLoginStatus(req, res);
    db.query('SELECT `Date` ,`Name`,`Content`,`Status`,`list`.`ID` AS `list-ID`, `node`.`ID` AS `Node-ID` ,`user`.`ID` AS `User-ID` FROM `user` INNER JOIN `todo-list` AS `list` ON `user`.`ID` = `list`.`User-ID` INNER JOIN `list-node` AS `node` ON `list`.`ID` = `node`.`List-ID` WHERE `user`.`ID` = ? AND `list`.`Date` = ?', [req.session.user.userId, `${req.params.year}-${req.params.month}-${req.params.day}`], function (error, results, fields) {
        if (error) return res.json(SetResJson(false, "伺服器錯誤", null));
        if (results.length < 1) {
            return res.json(SetResJson(true, "查無資料", null));
        }
        //時間處理
        results = results.map(item => {
            const date = new Date(item.Date);
            const formattedDate = date.toISOString().split('T')[0];
            return { ...item, Date: formattedDate };
        });
        // console.log(results);
        res.json(SetResJson(true, null, results));
    });
});

router.patch('/myList/status/update', function (req, res) {
    //檢查訪問權限
    CheckLoginStatus(req, res);
    let data = req.body.checkBoxList;
    const categorizedData = data.map(str => str.split('_').map(Number));
    categorizedData.forEach((item) => {
        db.query('UPDATE `list-node` SET `Status`= ? WHERE `list-node`.`ID`= ?', [!item[1], item[0]], function (error, results, fields) {
            if (error) throw error;
        });
    })
    res.json(SetResJson(true, null, null));
});

router.post('/myList/create', function (req, res) {
    //檢查訪問權限
    if (req.session.user == null) return res.json(SetResJson(false, "未登入", null));
    CheckLoginStatus(req, res);
    const { listName, listData, Date } = req.body;
    if (listName === "" || listName === null) return res.json(SetResJson(false, "清單名稱不可為空白", null));
    if (listData.length === 0) return res.json(SetResJson(false, "應做事項至少要有一件事情", null));
    try {
        db.query('INSERT INTO `todo-list` (`User-ID`,`name`,`Date`) VALUE(?,?,?)', [req.session.user.userId, listName, Date], function (error, results, fields) {
            for (const item of listData) {
                db.query('INSERT INTO `list-node` (`List-ID`,`Content`) VALUE(?,?)', [results.insertId, item], function (error, results, fields) {
                });
            };
            return res.json(SetResJson(true, "新增成功", null));
        });
    } catch {
        return res.json(SetResJson(false, "伺服器錯誤，可能是使用者未登入", null));
    }

});


router.delete('/myList/delete/:listId', function (req, res) {
    //檢查訪問權限
    CheckLoginStatus(req, res);

    //先利用客戶端傳過來的listID抓取該List所屬的使用者ID，並利用抓取到的使用者ID與現在登入的使用者ID進行比對，來確認是否有權限進行刪除
    db.query('SELECT `User-ID` FROM `todo-list` WHERE `ID` = ?', [req.params.listId], function (error, results, fields) {
        if (results.length < 1) return res.json(SetResJson(false, "無效ListID"));
        let userIdFromDB = results[0]["User-ID"];
        if (userIdFromDB != req.session.user.userId) return res.json(SetResJson(false, "無法刪除不屬於自己的清單"));
        db.query('DELETE FROM `todo-list` WHERE `todo-list`.`ID` = ? AND `todo-list`.`User-ID`=?', [req.params.listId, req.session.user.userId],
            function (error, results, fields) {
                if (error) return res.json(SetResJson(false, "刪除失敗"));
                return res.json(SetResJson(true, null));
            });
    });
});

//!!!!!!!!!!!!!!!!!!!!!!!!
//目前想不到更好寫法，先用超醜寫法，把要更新的list底下的node先全部刪除，再新增使用者想要修改的
//隱憂 Database的auto increment會瘋狂暴增
//!!!!!!!!!!!!!!!!!!!!!!!!
router.post('/myList/edit/:listId', function (req, res) {

    //檢查訪問權限
    if (req.session.user == null) return res.json(SetResJson(false, "未登入", null));
    CheckLoginStatus(req, res);
    const { listData } = req.body;
    if (listData.length === 0) return res.json(SetResJson(false, "應做事項至少要有一件事情", null));

    db.query('SELECT `User-ID` FROM `todo-list` WHERE `ID` = ?', [req.params.listId], function (error, results, fields) {
        if (results.length < 1) return res.json(SetResJson(false, "無效ListID"));
        let userIdFromDB = results[0]["User-ID"];
        if (userIdFromDB != req.session.user.userId) return res.json(SetResJson(false, "無法修改不屬於自己的清單"));
        db.query('DELETE FROM `list-node` WHERE `list-node`.`List-ID` = ?', [req.params.listId], function (error, results, fields) {
            for (const item of listData) {
                db.query('INSERT INTO `list-node` (`List-ID`,`Content`) VALUE(?,?)', [req.params.listId, item], function (error, results, fields) {
                });
            };
            return res.json(SetResJson(true, "修改成功", null));
        });
    });
});

app.use('/', router);

app.listen(port, function () {
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
function SetResJson(success, message = null, data = null) {
    return resJson = {
        "success": success,
        "message": message,
        "data": data
    };
}


/**
 * 檢查訪問權限
 * @function CheckLoginStatus
 * @param {Object} user - 使用者 session 物件
 * @returns {Object} - 包含狀態和訊息的物件
 */
function CheckLoginStatus(req, res) {
    if (req.session.user == null || !req.session.user || !req.session.user.isLoggedIn) {
        res.status(401);
        return res.json(SetResJson(false, '權限不足'));
    }
}