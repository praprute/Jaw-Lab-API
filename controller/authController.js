const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('./../config')

exports.register = (req, res, next) => {
    var {
        body
    } = req;

    var username = body.username;
    var password = body.password;
    var name = body.name;

    // console.log(body)

    req.getConnection((err, connection) => {
        if (err) return next(err)

            // console.log(name.length)
            if (username.length > 0) {
                if (password.length > 0) {
                    var sql = "SELECT*FROM `jaw-app`.`users` WHERE username=?;"
                    connection.query(sql, [username], (err, results) => {
                        if (err || results.length > 0) {
                        //     return next(err)
                        // }
                        // if (results.length > 0) {
                            res.json({
                                success: "error",
                                message: null,
                                message_th: "username is duplicate"
                            });
                        } else {
                            var sql = "INSERT INTO `jaw-app`.`users` ( username, password) \
                            VALUES (?, ?);"
                            connection.query(sql, [username, password], (err, results) => {
                                if (err) {
                                    return next(err)
                                } else {
                                    res.json({
                                        success: "success",
                                        message: results,
                                        message_th: "สร้างบัญชีผู้ใช้งานเสร็จเรียบร้อย"
                                    })
                                }
                            })
                        }
                    })

                } else {
                    res.json({
                        success: "error",
                        message: null,
                        message_th: "password ไม่ถูกต้อง"
                    })
                }
            } else {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "กรุณากรอกข้อมูลให้ครบถ้วน"
                })
            }
    })
}

exports.requireSignin = expressJwt({
    secret: config.secret,
    userProperty: "auth",
    algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.signin = (req, res, next) => {
    
    var {
        body
    } = req;
// console.log(body)
    var username = body.username;
    var password = body.password;
    if(username == '' || password == ''){
        res.json({
            success: "error",
            message: null,
            message_th: "กรุณาใส่ข้อมูลให้ครบถ้วน"
        })
    }else{
         req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `jaw-app`.`users` WHERE username=? ;"
        connection.query(sql, [username], (err, results) => {
            if (err) {
                return next(err)
            }

            if (!results.length) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "ไม่พบบัญชีผู้ใช้"
                })
            }
            if (results[0].password !== password) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "รหัสผ่านไม่ถูกต้อง"
                })
            } else {
                const token = jwt.sign({
                    id: results.id
                }, config.secret)
                res.cookie('t', token, {
                    expire: new Date() + 9999
                })
                res.json({
                    success: "success",
                    user: {
                        idusers: results[0].idusers,
                        email: results[0].email,
                        // name: results[0].name,
                        role: results[0].role,
                    },
                    token: token,
                    message_th: "login success",
                })
            }
        })
    })
    }
   
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        success: "success",
        message: "Signout Success"
    });
}

