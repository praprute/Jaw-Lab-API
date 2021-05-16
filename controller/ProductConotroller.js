const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('./../config');
const { connect } = require('pm2');
const imageToBase64 = require('image-to-base64');

exports.addOrder = (req, res, next) => {
    var {
        body
    } = req;

    var pord        = body.PORD
    var bbe         = body.BBE
    var po          = body.PO
    var productname = body.ProductName
    var size        = body.Size
    var quantity    = body.Quantity
    var idchem      = body.idScfChem
    var idmicro     = body.idScfMicro
    var priority    = body.Priority

    var Tn          = body.Tn
    var PH          = body.PH
    var Salt        = body.Salt 
    var Tss         = body.Tss 
    var Histamine   = body.Histamine 
    var SPG         = body.Spg 
    var Aw          = body.Aw 

    var Micro       = body.Micro
    // var insertIdOrder  = ""
    // console.log('add order : ', body)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "INSERT INTO `jaw-app`.`Orders` ( PORD, BBE, PO, ProductName, Size, Quantity , idScfChem, idScfMicro, Priority, Tn, PH, Salt, Tss , Histamine, Spg, Aw, Micro) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)"
        connection.query(sql,[pord , bbe ,po ,productname,size,quantity,idchem  ,idmicro ,priority ,Tn, PH, Salt, Tss, Histamine, SPG, Aw, Micro] , (err, results) => {
            if(err){
                return next(err)
            }else{
                // console.log(results)
                // insertIdOrder = insertId
                // res.json({
                //     success: "success",
                //     message: results,
                //     message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย"
                // })
                var idOrders  = results.insertId
                req.getConnection((err, connection) => {
                    if(err) return next(err)
            
                    var sql ="INSERT INTO `jaw-app`.`testResults` \
                     ( `Recheck`, `idSpfChem`, \
                    `Tn`, `PH`, `Salt`, `Tss`, \
                    `Histamine`, `SPGTest`, `Aw`, \
                    `idSpfMicro`, `APC`, \
                    `Yeasts`, `EColi`, `Coliform`, \
                    `Saureus`, `idOrderTested`, `tempPH` ,`tempAW` ,`tempTss` ,`tempSPG`,  `TnC`, `PHC`, `SaltC`, `TssC`, `HistamineC`, `SpgC`, `AwC`, `MicroC` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?, ?, ?, ?, ?, ?, ?, ?, ? ) ; "
                     connection.query(sql, [ 0, idchem, null, null, null, null, null, null, null, idmicro, null, null, null, null,
                        null, idOrders, null , null , null, null, Tn, PH, Salt, Tss, Histamine, SPG, Aw, Micro
                    ], (err, results) => {
                        if(err){
                            return next(err)
                        }else{
                            res.json({
                                success: "success",
                                message: results,
                                idAddOrder : idOrders,
                                message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย"
                            })
                        }
                     })
                })
            }
        })
    })
    // if(pord !== 'Invalid date'){
    //     if(bbe !== 'Invalid date'){
    //         if(po !== ''){
    //             if(productname !== '' ){
    //                if(size !== ''){
    //                 if(quantity !== ''){
    //                     if(idchem !== ''){
    //                         if(idmicro !== ''){
    //                              if(priority !== ''){
    //                                 req.getConnection((err, connection) => {
    //                                     if (err) return next(err)
    //                                     var sql = "INSERT INTO `jaw-app`.`Orders` ( PORD, BBE, PO, ProductName, Size, Quantity , idScfChem, idScfMicro, Priority) \
    //                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    //                                     connection.query(sql,[pord , bbe ,po ,productname,size,quantity,idchem  ,idmicro ,priority] , (err, results) => {
    //                                         if(err){
    //                                             return next(err)
    //                                         }else{
    //                                             // console.log(results)
    //                                             // insertIdOrder = insertId
    //                                             // res.json({
    //                                             //     success: "success",
    //                                             //     message: results,
    //                                             //     message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย"
    //                                             // })
    //                                             var idOrders  = results.insertId
    //                                             req.getConnection((err, connection) => {
    //                                                 if(err) return next(err)
                                            
    //                                                 var sql ="INSERT INTO `jaw-app`.`testResults` \
    //                                                  ( `Recheck`, `idSpfChem`, \
    //                                                 `Tn`, `PH`, `Salt`, `Tss`, \
    //                                                 `Histamine`, `SPGTest`, `Aw`, \
    //                                                 `idSpfMicro`, `APC`, \
    //                                                 `Yeasts`, `EColi`, `Coliform`, \
    //                                                 `Saureus`, `idOrderTested`, `tempPH` ,`tempAW` ,`tempTss` ,`tempSPG` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? ) ; "
    //                                                  connection.query(sql, [ 0, idchem, null, null, null, null, null, null, null, idmicro, null, null, null, null,
    //                                                     null, idOrders, null , null , null, null
    //                                                 ], (err, results) => {
    //                                                     if(err){
    //                                                         return next(err)
    //                                                     }else{
    //                                                         res.json({
    //                                                             success: "success",
    //                                                             message: results,
    //                                                             idAddOrder : idOrders,
    //                                                             message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย"
    //                                                         })
    //                                                     }
    //                                                  })
    //                                             })
    //                                         }
    //                                     })
    //                                 })
    //                             }else{
    //                                     res.json({
    //                                     success: "error",
    //                                     // message: results,
    //                                     message_th: "priority"
    //                                 })
    //                             }
    //                         }else{
    //                             res.json({
    //                                 success: "error",
    //                                 // message: results,
    //                                 message_th: "idmicro"
    //                             })
    //                         }
    //                     }else{
    //                         res.json({
    //                             success: "error",
    //                             // message: results,
    //                             message_th: "idchem"
    //                         })
    //                     }
    //                 }else{
    //                         res.json({
    //                         success: "error",
    //                         // message: results,
    //                         message_th: "quantity"
    //                     })
    //                 }
    //                 }else{
    //                     res.json({
    //                         success: "error",
    //                         // message: results,
    //                         message_th: "size"
    //                     })
    //                 }
    //             }else{
    //                      res.json({
    //                     success: "error",
    //                     // message: results,
    //                     message_th: "productname"
    //                 })
    //             }
    //         }else{
    //             res.json({
    //                 success: "error",
    //                 // message: results,
    //                 message_th: "po"
    //             })
    //         }
    //     }else{
    //         res.json({
    //         success: "error",
    //         // message: results,
    //         message_th: "bbe"
    //     })
    //     }
    // }else{
    //     res.json({
    //         success: "error",
    //         // message: results,
    //         message_th: "pord"
    //     })
    // } 
}

exports.updateOrder = (req, res, next) => {
    var {
        body
    } = req;


    var pord        = body.PORD
    var bbe         = body.BBE
    var po          = body.PO
    var productname = body.ProductName
    var size        = body.Size
    var quantity    = body.Quantity
    var idchem      = body.idScfChem
    var idmicro     = body.idScfMicro
    var priority    = body.Priority
    var idOrders    = body.idOrders

    var Tn          = body.Tn
    var PH          = body.PH
    var Salt        = body.Salt 
    var Tss         = body.Tss 
    var Histamine   = body.Histamine 
    var SPG         = body.Spg 
    var Aw          = body.Aw 
    var Micro       = body.Micro
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "UPDATE `jaw-app`.`Orders` SET  PORD=?, BBE=?, PO=?, ProductName=?, Size=?, Quantity=?, idScfChem=?, idScfMicro=?, Priority=? ,Tn=? , PH =? , Salt=?, Tss=?, Histamine=?, Spg=?, Aw=? ,Micro=?\
        WHERE idOrders=?"
        connection.query(sql,[pord , bbe ,po ,productname,size,quantity,idchem  ,idmicro ,priority, Tn, PH, Salt, Tss, Histamine, SPG, Aw , Micro, idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                var sql2 ="UPDATE `jaw-app`.`testResults` SET  \
                            TnC = ? , PHC =? , SaltC = ? , TssC = ?, \
                            HistamineC = ? , SpgC = ?, AwC = ?, MicroC=? WHERE idOrderTested = ? "
                    connection.query(sql2, [Tn, PH, Salt, Tss, Histamine, SPG, Aw , Micro, idOrders], (err, results) => {
                        if(err){
                            return next(err)
                        }else{
                             res.json({
                                success: "success",
                                message: results,
                                message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                            })
                        }
                       
                    })
            }
        })
    })
}

exports.reSend = (req, res, next) => {
    var {
        body
    } = req;


    var idOrders    = body.idOrders

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "UPDATE `jaw-app`.`Orders` SET  Status=0 WHERE idOrders = ?"
        connection.query(sql,[idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.deleteOrder = (req, res, next) => {
    var {
        body
    } = req;
    // console.log('deleteOrder : ' ,body)
   
    var idOrders    = body.idOrders
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var CheckReaTimeOrder = "SELECT*FROM `jaw-app`.RealTimeOrder WHERE idOrder=?"
        connection.query(CheckReaTimeOrder,[idOrders], (err, results) => {
            if(err){
                return next(err)
                }else{
                    if(results.length > 0){
                        var sqlDeleteRealTime = "DELETE FROM `jaw-app`.`RealTimeOrder` WHERE idOrder=?"
                        connection.query(sqlDeleteRealTime,[idOrders] , (err, results2) => {
                            if(err){
                                return next(err)
                            }else{
                                var Checktested =  "SELECT*FROM `jaw-app`.testResults WHERE idOrderTested=?"
                                connection.query(Checktested, [idOrders], (err, results3) => {
                                    if(err){
                                        return next(err)
                                    }else{
                                        if(results3.length > 0){
                                            var sqlTestDelete = "DELETE FROM `jaw-app`.testResults WHERE idOrderTested=?"
                                            connection.query(sqlTestDelete, [idOrders], (err, results4) => {
                                                if(err){
                                                    return next(err)
                                                }else{
                                                    var sql = "DELETE FROM `jaw-app`.`Orders` WHERE idOrders=?"
                                                    connection.query(sql,[idOrders] , (err, results5) => {
                                                        if(err){
                                                            return next(err)
                                                        }else{
                                                            res.json({
                                                                success: "success",
                                                                message: results5,
                                                                message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย"
                                                            }) 
                                                        }
                                                    })
                                                }
                                            })
                                        }else{
                                            var sql = "DELETE FROM `jaw-app`.`Orders` WHERE idOrders=?"
                                            connection.query(sql,[idOrders] , (err, results6) => {
                                                if(err){
                                                    return next(err)
                                                }else{
                                                    res.json({
                                                        success: "success",
                                                        message: results6,
                                                        message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย"
                                                    }) 
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }else{
                        var sql = "DELETE FROM `jaw-app`.`Orders` WHERE idOrders=?"
                        connection.query(sql,[idOrders] , (err, results7) => {
                            if(err){
                                return next(err)
                            }else{
                                res.json({
                                    success: "success",
                                    message: results7,
                                    message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย"
                                })
                            }
                        })
                    }
                }
        })
    })
}

exports.readAllOrder = (req, res, next) => {
    var {
        body
    } = req;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `jaw-app`.Orders, \
        `jaw-app`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.timestamp DESC"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readOrdertoCheck = (req, res, next) => {
    var {
        body
    } = req;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `jaw-app`.Orders, \
        `jaw-app`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.Priority DESC"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}


exports.urgentOrders = (req, res, next) => {
    var {
        body
    } = req;

    priority = body.Priority

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `jaw-app`.Orders, \
        `jaw-app`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem AND Orders.Priority = ? ORDER BY Orders.timestamp DESC"
        connection.query(sql,[priority] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readRealTimeOrder = (req, res, next) => {
    var {
        body
    } = req;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT * FROM `jaw-app`.Orders,`jaw-app`.RealTimeOrder ,`jaw-app`.PdSpecificChem \
        WHERE Orders.idOrders = RealTimeOrder.idOrder  AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.timestamp DESC LIMIT 5"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    }) 
}
exports.addRealTimeOrder = (req, res, next) => {
    var {
        body
    } = req;

    var idOrders    = body.idOrders

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "INSERT INTO `jaw-app`.RealTimeOrder (`idOrder`) VALUES (?);"
        connection.query(sql,[idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    }) 
}



exports.readRecheckOrder = (req, res, next) => {
    var {
        body
    } = req;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "select * from `jaw-app`.Orders, `jaw-app`.PdSpecificChem \
         where Orders.Recheck > 0 AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem  ORDER BY Orders.timestamp DESC"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.realTimeTable = () => {

}

exports.readOrderById = (req, res, next) => {
    
    var {
        body
    } = req;

    var idOrders    = body.idOrders
    
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT*FROM `jaw-app`.`Orders`, `jaw-app`.`PdSpecificChem` WHERE idOrders = ? AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem"
        connection.query(sql,[idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readAllSpecificChem = (req, res, next) => {
    var {
        body
    } = req

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT*FROM `jaw-app`.`PdSpecificChem`"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readAllSpecificMicro = (req, res, next) => {
    var {
        body
    } = req

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT*FROM `jaw-app`.`PdSpecificMicro`"
        connection.query(sql,[] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readIdChem = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT idPdSpecificChem ,name FROM `jaw-app`.PdSpecificChem;"
        connection.query(sql, [] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล Spc Chem => id, Name"
                })
            }
        })
    })
}

exports.readIdMicro = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT idPdSpecificMicro ,name FROM `jaw-app`.PdSpecificMicro;"
        connection.query(sql, [] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูล Spc Chem => id, Name"
                })
            }
        })
    })
}

exports.readAllSpecificChemById = (req, res, next) => {
    var {
        body
    } = req
    var idPdSpecificChem    = body.idPdSpecificChem 
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT*FROM `jaw-app`.`PdSpecificChem` WHERE idPdSpecificChem = ?"
        connection.query(sql,[idPdSpecificChem] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูลสูตรน้ำปลาเรียบร้อย"
                })
            }
        })
    })
}

exports.readAllSpecificBioById = (req, res, next) => {
    var {
        body
    } = req
    var idPdSpecificMicro    = body.idPdSpecificMicro 
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT*FROM `jaw-app`.`PdSpecificMicro` WHERE idPdSpecificMicro = ?"
        connection.query(sql,[idPdSpecificMicro] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการอ่านข้อมูลสูตรน้ำปลาเรียบร้อย"
                })
            }
        })
    })
}

exports.addSpecificChem = (req, res, next) => {
    var {
        body
    } = req;

    //var idPdSpecificChem    = body.idPdSpecificChem   
    var name                = body.name               
    var TnMain              = body.TnMain             
    var TnMax               = body.TnMax              
    var PHControlMin        = body.PHControlMin       
    var PHControlMax        = body.PHControlMax      
    var PHCOAMin            = body.PHCOAMin          
    var PHCOAMax            = body.PHCOAMax          
    var SaltControlMin      = body.SaltControlMin    
    var SaltControlMax      = body.SaltControlMax    
    var SaltCOAMin          = body.SaltCOAMin        
    var SaltCOAMax          = body.SaltCOAMax        
    var TSSMin              = body.TSSMin            
    var TSSMax              = body.TSSMax            
    var HistamineMin        = body.HistamineMin      
    var HistamineMax        = body.HistamineMax      
    var SPG                 = body.SPG               
    var AWMin               = body.AWMin             
    var AWMax               = body.AWMax            
 
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var sql = "SELECT `jaw-app`.`PdSpecificChem`.name FROM `jaw-app`.PdSpecificChem WHERE name=?";
        connection.query(sql,[name] , (err, results) => {
            if(err){
                return next(err)
            }else{
                if(results.length > 0){
                    res.json({
                        success: "error",
                        message: results,
                        message_th: "Specific Chem has duplicate"
                    })
                }else{
                    var sqlInsertSpecific = "INSERT INTO `jaw-app`.`PdSpecificChem` ( name ,\
                        TnMain          ,\
                        TnMax           ,\
                        PHControlMin    ,\
                        PHControlMax    ,\
                        PHCOAMin        ,\
                        PHCOAMax        ,\
                        SaltControlMin  ,\
                        SaltControlMax  ,\
                        SaltCOAMin      ,\
                        SaltCOAMax      ,\
                        TSSMin          ,\
                        TSSMax          ,\
                        HistamineMin    ,\
                        HistamineMax    ,\
                        SPG             ,\
                        AWMin           ,\
                        AWMax           ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                }
                connection.query(sqlInsertSpecific, [name    ,       
                    TnMain         ,
                    TnMax          ,
                    PHControlMin   ,
                    PHControlMax   ,
                    PHCOAMin       ,
                    PHCOAMax       ,
                    SaltControlMin ,
                    SaltControlMax ,
                    SaltCOAMin     ,
                    SaltCOAMax     ,
                    TSSMin         ,
                    TSSMax         ,
                    HistamineMin   ,
                    HistamineMax   ,
                    SPG            ,
                    AWMin          ,
                    AWMax          ] , (err, resultsInsert) => {
                    if(err){
                        return next(err)
                    }else{
                        res.json({
                            success: "success",
                            message: resultsInsert,
                            message_th: "Add Specific Chem Success"
                        })
                    }
                })
                //var sqlInsertSpecific = 
            }
        })
    })
}

exports.updateSpecificChem = (req, res, next) => {
    var {
        body
    } = req;

    var idPdSpecificChem    = body.idPdSpecificChem   
    var name                = body.name               
    var TnMain              = body.TnMain             
    var TnMax               = body.TnMax              
    var PHControlMin        = body.PHControlMin       
    var PHControlMax        = body.PHControlMax      
    var PHCOAMin            = body.PHCOAMin          
    var PHCOAMax            = body.PHCOAMax          
    var SaltControlMin      = body.SaltControlMin    
    var SaltControlMax      = body.SaltControlMax    
    var SaltCOAMin          = body.SaltCOAMin        
    var SaltCOAMax          = body.SaltCOAMax        
    var TSSMin              = body.TSSMin            
    var TSSMax              = body.TSSMax            
    var HistamineMin        = body.HistamineMin      
    var HistamineMax        = body.HistamineMax      
    var SPG                 = body.SPG               
    var AWMin               = body.AWMin             
    var AWMax               = body.AWMax         

    req.getConnection((err, connection) => {
        if(err) return next(err)
        var sql = "UPDATE `jaw-app`.`PdSpecificChem` SET  name =? ,\
            TnMain          =? ,\
            TnMax           =? ,\
            PHControlMin    =? ,\
            PHControlMax    =? ,\
            PHCOAMin        =? ,\
            PHCOAMax        =? ,\
            SaltControlMin  =? ,\
            SaltControlMax  =? ,\
            SaltCOAMin      =? ,\
            SaltCOAMax      =? ,\
            TSSMin          =? ,\
            TSSMax          =? ,\
            HistamineMin    =? ,\
            HistamineMax    =? ,\
            SPG             =? ,\
            AWMin           =? ,\
            AWMax=?   WHERE idPdSpecificChem = ?"
            connection.query(sql, [name    ,       
                TnMain         ,
                TnMax          ,
                PHControlMin   ,
                PHControlMax   ,
                PHCOAMin       ,
                PHCOAMax       ,
                SaltControlMin ,
                SaltControlMax ,
                SaltCOAMin     ,
                SaltCOAMax     ,
                TSSMin         ,
                TSSMax         ,
                HistamineMin   ,
                HistamineMax   ,
                SPG            ,
                AWMin          ,
                AWMax          ,
                idPdSpecificChem
            ] , (err, results) => {
                if(err){
                    return next(err)
                }else{
                    res.json({
                        success: "success",
                        message: results,
                        message_th: "Update Specific Chem Success"
                    })
                }
            })
    })
}

exports.DeleteSpecificChemById = (req, res, next) => {
    var {
        body
    } = req
    var idPdSpecificChem    = body.idPdSpecificChem 
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "DELETE FROM `jaw-app`.`PdSpecificChem` WHERE idPdSpecificChem = ?"
        connection.query(sql,[idPdSpecificChem] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการลบสูตรน้ำปลาเรียบร้อย"
                })
            }
        })
    })
}

exports.Addtestreport = (req, res, next) => {
    var {
        body
    } = req;
    var idOrders    = body.idOrders
    var PORD        = body.PORD 
    var BBE         = body.BBE
    var PO          = body.PO
    var ProductName = body.ProductName
    var Recheck     = body.Recheck
    var Size        = body.Size
    var Quantity    = body.Quantity
    var idSpfChem   = body.idSpfChem
    var Tn          = body.Tn
    var PH          = body.PH
    var Salt        = body.Salt 
    var Tss         = body.Tss 
    var Histamine   = body.Histamine 
    var SPG         = body.SPG 
    var Aw          = body.Aw 
    var idSpfMicro  = body.idSpfMicro 
    var APC         = body.APC 
    var Yeasts      = body.Yeasts 
    var EColi       = body.EColi 
    var Coliform    = body.Coliform 
    var Saureus     = body.Saureus 
    var TempPH      = body.TempPH
    var TempAW      = body.TempAW
    var TempTSS     = body.TempTSS
    var TempSPG      = body.TempSPG
    // console.log('body : ' , body)
    req.getConnection((err, connection) => {
        if(err) return next(err)
        // var sql = "UPDATE `jaw-app`.`Orders` SET  PORD=?, BBE=?, PO=?, ProductName=?, Size=?, Quantity=?, idScfChem=?, idScfMicro=?, Priority=? \
        // WHERE idOrders=?"
        
        // var sql ="INSERT INTO `jaw-app`.`testResults` \
        //  ( `Recheck`, `idSpfChem`, \
        // `Tn`, `PH`, `Salt`, `Tss`, \
        // `Histamine`, `SPGTest`, `Aw`, \
        // `idSpfMicro`, `APC`, \
        // `Yeasts`, `EColi`, `Coliform`, \
        // `Saureus`, `idOrderTested`, `tempPH` ,`tempAW` ,`tempTss` ,`tempSPG` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? ) ; "
        
        var sql ="UPDATE `jaw-app`.`testResults` SET Recheck = ?, idSpfChem = ?, \
        Tn = ? , PH =? , Salt = ? , Tss = ?, \
        Histamine = ? , SPGTest = ?, Aw = ?, \
        idSpfMicro = ?, APC = ?, \
        Yeasts = ?, EColi = ?, Coliform = ? , \
        Saureus = ? , tempPH = ? , tempAW = ? , tempTss = ?  , tempSPG = ? WHERE idOrderTested = ? "
         connection.query(sql, [ Recheck, idSpfChem, Tn,
        PH, Salt, Tss, Histamine, SPG, Aw, idSpfMicro, APC, Yeasts, EColi, Coliform,
        Saureus, TempPH , TempAW , TempTSS, TempSPG, idOrders
        ], (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "Add Specific Chem Success"
                })
            }
         })
    })
}

function testResult(index){
    if(index){
        var results = []
        var TestedIndex = []
        var TimeToTest = []
            //TN
            if(index.Tn == null){
                let tnn = {
                    render:index.TnC , int:false , coa:false, val:index.Tn, valTn:index.Tn , key:'TN(g/L)' , temp:false , keyInput:"Tn" , tkTemp:false
                }
                TestedIndex.push(tnn)
            }else if(index.Tn >= index.TnMain && index.Tn <= index.TnMax ){
                let tnn = {
                    render:index.TnC ,int:true , coa:true , val:index.Tn, valTn:index.Tn , key:'TN(g/L)' , temp:false , keyInput:"Tn"  , tkTemp:false
                }
                TestedIndex.push(tnn)
            }else{
                let tnn = {
                    render:index.TnC , int:false , coa:false, val:index.Tn, valTn:index.Tn , key:'TN(g/L)' , temp:false , keyInput:"Tn" , tkTemp:false
                }
                TestedIndex.push(tnn)
            }
            
            //Salt
            if(index.Salt == null){
                let Salt = {
                    render:index.SaltC ,  int:false , coa:false, val:index.Salt, valSalt:index.Salt ,  key:'%Salt(w/v)' , temp:false ,keyInput:"Salt", tkTemp:false
                }
                TestedIndex.push(Salt)
            }else if(index.Salt >= index.SaltControlMin && index.Salt <= index.SaltCOAMax ){
                if(index.Salt <= index.SaltCOAMin){
                let Salt = {
                    render:index.SaltC , int:true , coa:true, val:index.SaltCOAMin, valSalt:index.SaltCOAMin , key:'%Salt(w/v)' , temp:false ,keyInput:"Salt", tkTemp:false
                }
                TestedIndex.push(Salt) 
                }else{
                    let Salt = {
                        render:index.SaltC ,  int:true , coa:true, val:index.Salt, valSalt:index.Salt , key:'%Salt(w/v)' , temp:false ,keyInput:"Salt", tkTemp:false
                    }
                    TestedIndex.push(Salt) 
                }
            }else{
                let Salt = {
                    render:index.SaltC ,  int:false , coa:false, val:index.Salt, valSalt:index.Salt ,  key:'%Salt(w/v)' , temp:false ,keyInput:"Salt", tkTemp:false
                }
                TestedIndex.push(Salt)
            }
            
            //Histamine
            //console.log('index.Histamine : ', index.Histamine)
            if(index.Histamine == null){
                let His = {
                    render:index.HistamineC ,int:false , coa:false , val:index.Histamine, valHistamine:index.Histamine , key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine", tkTemp:false
                }
                TestedIndex.push(His)
            }else if(index.Histamine >= index.HistamineMin && index.Histamine <= index.HistamineMax){
                let His = {
                    render:index.HistamineC ,int:true , coa:true , val:index.Histamine, valHistamine:index.Histamine, key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine", tkTemp:false
                }
                TestedIndex.push(His)
            }else{
                let His = {
                    render:index.HistamineC ,int:false , coa:false , val:index.Histamine, valHistamine:index.Histamine , key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine", tkTemp:false
                }
                TestedIndex.push(His)
            }
            //PH
            if(index.PH >= index.PHControlMin && index.PH <= index.PHCOAMax ){
                if(index.PH <= index.PHCOAMin){
                    let phh = {
                        render:index.PHC ,int:true , coa:true, val:index.PHCOAMin, valPH:index.PHCOAMin ,  key:'PH' , temp:index.tempPH , keyInput:"PH" , keyTemp:'TempPH' , tkTemp:true
                    }
                    TestedIndex.push(phh)
                }else{
                    let phh = {
                        render:index.PHC ,int:true , coa:true, val:index.PH, valPH:index.PH, key:'PH' ,  temp:index.tempPH , keyInput:"PH", keyTemp:'TempPH' , tkTemp:true
                }
                TestedIndex.push(phh)
                }
            }else{
                let phh = {
                    render:index.PHC ,int:false , coa:false, val:index.PH, valPH:index.PH  , key:'PH' , temp:index.tempPH , keyInput:"PH", keyTemp:'TempPH' , tkTemp:true
                }
                TestedIndex.push(phh)
            }
            //AW
            if(index.Aw == null){
                let Aw = {
                    render:index.AwC , int:false , coa:false , val:index.Aw, valAw:index.Aw , key:'Aw', temp:index.tempAW ,keyInput:"Aw", keyTemp:'TempAW' , tkTemp:true
                }
                TestedIndex.push(Aw)
            }else if(index.Aw >= index.AWMin && index.Aw <= index.AWMax){
                let Aw = {
                    render:index.AwC , int:true , coa:true , val:index.Aw, valAw:index.Aw , key:'Aw', temp:index.tempAW ,keyInput:"Aw", keyTemp:'TempAW' , tkTemp:true
                }
                TestedIndex.push(Aw)
            }else{
                let Aw = {
                    render:index.AwC , int:false , coa:false , val:index.Aw, valAw:index.Aw , key:'Aw', temp:index.tempAW ,keyInput:"Aw", keyTemp:'TempAW' , tkTemp:true
                }
                TestedIndex.push(Aw)
            }
            //TSS
            if(index.Tss == null){
                let Tss = {
                    render:index.TssC ,int:false , coa:false , val:null, valTss:null, key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'TempTSS' , tkTemp:true
                }
                TestedIndex.push(Tss)
            }else if(index.Tss >= index.TSSMin && index.Tss <= index.TSSMax){
                let Tss = {
                    render:index.TssC ,int:true , coa:true , val:index.Tss, valTss:index.Tss ,key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'TempTSS' , tkTemp:true
                }
                TestedIndex.push(Tss)
            }else{
                let Tss = {
                    render:index.TssC ,int:false , coa:false , val:index.Tss, valTss:index.Tss ,key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'TempTSS' , tkTemp:true
                }
                TestedIndex.push(Tss)
            }
            //SPG
            //console.log(index.SPGTest)
            if(index.SPGTest == null){
                let spg = {
                    render:index.SpgC ,int:false , coa:false , val:index.SPGTest, valSPG:index.SPGTest, key:'SPG', temp:index.tempSPG ,keyInput:"SPG" , keyTemp:'TempSPG' , tkTemp:true
                }
                TestedIndex.push(spg)
            }else if(index.SPGTest >= 0 && index.SPGTest <= index.SPG){
                let spg = {
                    render:index.SpgC ,int:true , coa:true , val:index.SPGTest, valSPG:index.SPGTest ,key:'SPG', temp:index.tempSPG ,keyInput:"SPG" , keyTemp:'TempSPG' , tkTemp:true
                }
                TestedIndex.push(spg)
            }else{
                let spg = {
                    render:index.SpgC ,int:false , coa:false , val:index.SPGTest, valSPG:index.SPGTest, key:'SPG', temp:index.tempSPG ,keyInput:"SPG" , keyTemp:'TempSPG' , tkTemp:true
                }
                TestedIndex.push(spg)
            }
            

            var bio = [] 
            // APC
            if(index.APC == null){
                let apc = {
                    int:false , coa:false , val:index.APC, key:'APC', keyInput:'APC'
                }
                bio.push(apc)
            }else{
                if(index.APC >= index.APCMin && index.APC <= index.APCMax){
                let apc = {
                    int:true , coa:true , val:index.APC, key:'APC', keyInput:'APC'
                }
                bio.push(apc)
            }else{
                let apc = {
                    int:false , coa:false , val:index.APC, key:'APC', keyInput:'APC'
                }
                bio.push(apc)
            }
            }
            
            // Yeasts & Molds
            if(index.Yeasts == null){
                let Yeasts = {
                    int:false , coa:false , val:index.Yeasts, key:'Yeasts & Molds', keyInput:'Yeasts'
                }
                bio.push(Yeasts)
            }else{
            if(index.Yeasts >= index.YeastsMin && index.Yeasts <= index.YeastsMax){
                let Yeasts = {
                    int:true , coa:true , val:index.Yeasts, key:'Yeasts & Molds', keyInput:'Yeasts'
                }
                bio.push(Yeasts)
            }else{
                let Yeasts = {
                    int:false , coa:false , val:index.Yeasts, key:'Yeasts & Molds', keyInput:'Yeasts'
                }
                bio.push(Yeasts)
            }
            }
            
            // E. coil
            if(index.EColi == null){
                let EColi = {
                    int:false , coa:false , val:index.EColi, key:'E. coil', keyInput:'EColi'
                }
                bio.push(EColi)
            }else{
        if(index.EColi >= index.EColiMin && index.EColi <= index.EColiMax){
                        let EColi = {
                            int:true , coa:true , val:index.EColi, key:'E. coil', keyInput:'EColi'
                        }
                        bio.push(EColi)
                    }else{
                        let EColi = {
                            int:false , coa:false , val:index.EColi, key:'E. coil', keyInput:'EColi'
                        }
                        bio.push(EColi)
                    }
            }
            
            // Coliform
            if(index.Coliform == null){
                let Coliform = {
                    int:false , coa:false , val:index.Coliform, key:'Coliform', keyInput:'Coliform'
                }
                bio.push(Coliform)
            }else{
                if(index.Coliform >= index.ColiformMin && index.Coliform <= index.ColiformMax){
                let Coliform = {
                    int:true , coa:true , val:index.Coliform, key:'Coliform', keyInput:'Coliform'
                }
                bio.push(Coliform)
            }else{
                let Coliform = {
                    int:false , coa:false , val:index.Coliform, key:'Coliform', keyInput:'Coliform'
                }
                bio.push(Coliform)
            }
            }
            
            // S. aureus
            if(index.Saureus == null){
                let Saureus = {
                    int:false , coa:false , val:index.Saureus, key:'S. aureus', keyInput:'Saureus'
                }
                bio.push(Saureus)
            }else{
                if(index.Saureus >= index.SaureusMin && index.Saureus <= index.SaureusMax){
                let Saureus = {
                    int:true , coa:true , val:index.Saureus, key:'S. aureus', keyInput:'Saureus'
                }
                bio.push(Saureus)
            }else{
                let Saureus = {
                    int:false , coa:false , val:index.Saureus, key:'S. aureus', keyInput:'Saureus'
                }
                bio.push(Saureus)
            }
            }
            

            TimeToTest.push({TimeTest : index.timestampTest})
            results.push(TestedIndex, bio, TimeToTest)
            // console.log('index : ', index)

            return(results)
            
    }else{
        return(null)
    }
    
}

exports.readTestReportlasted = (req, res, next) => {
    var {
        body
    } = req;
    // console.log(body)
    var idOrders    = body.idOrders
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `jaw-app`.testResults, `jaw-app`.PdSpecificChem  , `jaw-app`.PdSpecificMicro \
         WHERE testResults.idOrderTested = ? AND testResults.idSpfChem = PdSpecificChem.idPdSpecificChem  ORDER BY testResults.timestampTest DESC LIMIT 1;"
        connection.query(sql,[idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                // console.log(results[0])
                if(results[0] == undefined){
                    res.json({
                        success: "error",
                        message: "error",
                        // message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                    })
                }else{
                    // console.log('result : ',results[0])
                    var resultTested = testResult(results[0])
                    // console.log('resultTested : ',resultTested)
                    // console.log('spc chem name: ',results[0].name)
                    
                    res.json({
                        success: "success",
                        message: results[0],
                        resulted: resultTested,
                        message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย"
                    })
                }
            }
        })
    })
}

exports.Recheck = (req, res, next) => {
    var {
        body
    } = req;
    var idOrders    = body.idOrders
    var Recheck    = body.Recheck
    Recheck = Recheck+1
    
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "UPDATE `jaw-app`.`Orders` SET  Recheck=? , Status=2 WHERE idOrders = ?"
        connection.query(sql,[Recheck, idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                req.getConnection((err, connection) => {
                    if (err) return next(err)
            
                    var sql = "UPDATE `jaw-app`.`RealTimeCardDS` SET  Recheck=Recheck+1 WHERE idRealTimeCardDS = 1"
                    connection.query(sql,[Recheck, idOrders] , (err, results) => {
                        if(err){
                            return next(err)
                        }else{
                            
                            // console.log('Recheck : ', results)
                            res.json({
                                success: "success",
                                message: results,
                                message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                            })
                        }
                    })
                })
                // console.log('Recheck : ', results)
                // res.json({
                //     success: "success",
                //     message: results,
                //     message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                // })
            }
        })
    })
}

exports.WaitMicro = (req, res, next) => {
    var {
        body
    } = req;
    var idOrders    = body.idOrders
    // console.log('Recheck : ', body)
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "UPDATE `jaw-app`.`Orders` SET Status=3 WHERE idOrders = ?"
        connection.query(sql,[idOrders] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                })
            }
        })
    })
}

exports.readFG = (req, res, next) => {
    var {
        body
    } = req;

    var idOrders    = body.idOrders

    var current_datetime = new Date()
    let formatted_date_now = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + (current_datetime.getDate())
    
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT * FROM `jaw-app`.`RealTimeDonutFG` WHERE date=? "
        connection.query(sql,[formatted_date_now] , (err, results) => {
            if(err){
                return next(err)
            }else{
                // console.log(results.length)
                if(results.length > 0){
                    res.json({
                            success: "success",
                            message: results,
                            // message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                        })
                }else{
                    req.getConnection((err, connection) => {
                        if(err) return next(err)
                        var sql = "INSERT INTO `jaw-app`.`RealTimeDonutFG` (`TN` , `PH` , `SALT`, `TSS`, `HISTAMINE`, `SPG`, `AW`, `date`) VALUES (0, 0, 0, 0, 0, 0, 0, ?);"
                        connection.query(sql,[formatted_date_now],(err, results) => {
                            if(err){
                                return next(err)
                            }else{
                                res.json({
                            success: "success",
                            message: results,
                            // message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                        })
                            }
                        })
                    })
                }
            }
        })
    })
}

exports.readST = (req, res, next) => {
    var {
        body
    } = req;

    var idOrders    = body.idOrders

    var current_datetime = new Date()
    let formatted_date_now = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + (current_datetime.getDate())
    
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT * FROM `jaw-app`.`RealTimeDonutST` WHERE date=? "
        connection.query(sql,[formatted_date_now] , (err, results) => {
            if(err){
                return next(err)
            }else{
                // console.log(results.length)
                if(results.length > 0){
                    res.json({
                            success: "success",
                            message: results,
                            // message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                        })
                }else{
                    req.getConnection((err, connection) => {
                        if(err) return next(err)
                        var sql = "INSERT INTO `jaw-app`.`RealTimeDonutFG` (`water` , `swap` , `air`, `date`) VALUES (0, 0, 0, 0, ?);"
                        connection.query(sql,[formatted_date_now],(err, results) => {
                            if(err){
                                return next(err)
                            }else{
                                res.json({
                            success: "success",
                            message: results,
                            // message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย"
                        })
                            }
                        })
                    })
                }
            }
        })
    })
}

exports.updateFG = (req, res, next) => {
    var {
        body
    } = req;

    var Tn = body.Tn
    var PH = body.PH
    var Salt = body.Salt
    var Tss = body.Tss
    var Histamine = body.Histamine
    var SPG = body.SPG
    var Aw = body.Aw

    // console.log('updateFG : ' ,body)

    var current_datetime = new Date()
    let formatted_date_now = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + (current_datetime.getDate())
    
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "UPDATE `jaw-app`.`RealTimeDonutFG` SET `TN` = `TN`+? , `PH` = `PH`+? , `SALT`=`SALT`+?, `TSS`=`TSS`+?, `HISTAMINE`=`HISTAMINE`+?, `SPG`=`SPG`+?, `AW`=`AW`+? WHERE date=?"
        connection.query(sql, [Tn,PH,Salt,Tss,Histamine,SPG,Aw,formatted_date_now] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                })
            }
        })
    })
}

exports.updateSTadST = (req, res, next) => {
    var {
        body
    } = req;

    var Tn = body.Tn
    var PH = body.PH
    var Salt = body.Salt
    var Tss = body.Tss
    var Histamine = body.Histamine
    var SPG = body.SPG
    var Aw = body.Aw

    // console.log('updateFG : ' ,body)

    var current_datetime = new Date()
    let formatted_date_now = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + (current_datetime.getDate())
    
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "UPDATE `jaw-app`.`RealTimeDonutST` SET `water` = `water`+? , `swap` = `swap`+? , `air`=`air`+?, WHERE date=?"
        connection.query(sql, [Tn,PH,Salt,Tss,Histamine,SPG,Aw,formatted_date_now] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                })
            }
        })
    })
}

exports.updateCardDS = (req, res, next) => {
    var {
        body
    } = req;

    var allOrder
    var COA
    var Recheck 

    // console.log('updateFG : ' ,body)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `jaw-app`.Orders;"
        connection.query(sql, [] , (err, results) => {
            if(err){
                return next(err)
            }else{
                allOrder = results.length
                // console.log('allOrder : ', allOrder)
                req.getConnection((err, connection) => {
                    if (err) return next(err)
                    var sql = "UPDATE `jaw-app`.RealTimeCardDS SET ALLSample=?  WHERE idRealTimeCardDS = 1 ;"
                    connection.query(sql, [allOrder] , (err, results) => {
                        if(err){
                            return next(err)
                        }else{
                            res.json({
                                success: "success",
                                message: results,
                            })
                        }
                    })
                })
            }
        })
    })
}

exports.readCardDS = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `jaw-app`.RealTimeCardDS;"
        connection.query(sql, [] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                })
            }
        })
    })
}

exports.exportCOA = (req, res, next) => {
    // console.log('exportCOA')
    req.getConnection((err, connection) => {
        if (err){
            return next(err)
        }else{
            imageToBase64("https://jaw.sgp1.digitaloceanspaces.com/Logo-RFS.png") // Path to the image
        .then(
            (response) => {
                res.json({
                    success: "success",
                    message: response,
                })
                // console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
            }
        )
        .catch(
            (error) => {
                // console.log(error); // Logs an error if there was one
            }
        ) 
        }
    })
   
}

exports.UpdatexportCOA = (req, res, next) => {
    var {
        body
    } = req;

    // var idOrders    = body.idOrders
    // console.log('UpdatexportCOA : ', body)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "UPDATE `jaw-app`.RealTimeCardDS SET COAExprot=COAExprot+1  WHERE idRealTimeCardDS = 1 ;"
        connection.query(sql, [] , (err, results) => {
            if(err){
                return next(err)
            }else{
                res.json({
                    success: "success",
                    message: results,
                })  
            }
        })
    })
}

exports.UpdatexportPASS = (req, res, next) => {
    var {
        body
    } = req;

    var idOrders    = body.idOrders
    // console.log('UpdatexportCOA : ', body)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql2 = "UPDATE `jaw-app`.`Orders` SET Status=1 WHERE idOrders = ?"
                connection.query(sql2, [idOrders] , (err, results) => {
                    if(err){
                        return next(err)
                    }else{
                        res.json({
                            success: "success",
                            message: results,
                        })
                    }
                })
    })
}
