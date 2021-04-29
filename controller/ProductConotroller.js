const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('./../config')

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
    console.log('add order : ', body)
    if(pord !== 'Invalid date'){
        if(bbe !== 'Invalid date'){
            if(po !== ''){
                if(productname !== '' ){
                   if(size !== ''){
                    if(quantity !== ''){
                        if(idchem !== ''){
                            if(idmicro !== ''){
                                 if(priority !== ''){
                                    req.getConnection((err, connection) => {
                                        if (err) return next(err)
                                        var sql = "INSERT INTO `jaw-app`.`Orders` ( PORD, BBE, PO, ProductName, Size, Quantity , idScfChem, idScfMicro, Priority) \
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                        connection.query(sql,[pord , bbe ,po ,productname,size,quantity,idchem  ,idmicro ,priority] , (err, results) => {
                                            if(err){
                                                return next(err)
                                            }else{
                                                res.json({
                                                    success: "success",
                                                    message: results,
                                                    message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย"
                                                })
                                            }
                                        })
                                    })
                                }else{
                                        res.json({
                                        success: "error",
                                        // message: results,
                                        message_th: "priority"
                                    })
                                }
                            }else{
                                res.json({
                                    success: "error",
                                    // message: results,
                                    message_th: "idmicro"
                                })
                            }
                        }else{
                            res.json({
                                success: "error",
                                // message: results,
                                message_th: "idchem"
                            })
                        }
                    }else{
                            res.json({
                            success: "error",
                            // message: results,
                            message_th: "quantity"
                        })
                    }
                    }else{
                        res.json({
                            success: "error",
                            // message: results,
                            message_th: "size"
                        })
                    }
                }else{
                         res.json({
                        success: "error",
                        // message: results,
                        message_th: "productname"
                    })
                }
            }else{
                res.json({
                    success: "error",
                    // message: results,
                    message_th: "po"
                })
            }
        }else{
            res.json({
            success: "error",
            // message: results,
            message_th: "bbe"
        })
        }
    }else{
        res.json({
            success: "error",
            // message: results,
            message_th: "pord"
        })
    } 
}

exports.updateOrder = (req, res, next) => {
    var {
        body
    } = req;

    console.log(body)

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

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "UPDATE `jaw-app`.`Orders` SET  PORD=?, BBE=?, PO=?, ProductName=?, Size=?, Quantity=?, idScfChem=?, idScfMicro=?, Priority=? \
        WHERE idOrders=?"
        connection.query(sql,[pord , bbe ,po ,productname,size,quantity,idchem  ,idmicro ,priority,idOrders] , (err, results) => {
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

exports.reSend = (req, res, next) => {
    var {
        body
    } = req;

    console.log(body)

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
    console.log('deleteOrder : ' ,body)
   
    var idOrders    = body.idOrders

    req.getConnection((err, connection) => {
        if (err) return next(err)
        
        var Checktested =  "SELECT*FROM `jaw-app`.testResults WHERE idOrderTested=?"
        connection.query(Checktested, [idOrders], (err, results) => {
            console.log('results.length : ',results.length)
            if(results.length > 0){
                var sqlTestDelete = "DELETE FROM `jaw-app`.testResults WHERE idOrderTested=?"
                    connection.query(sqlTestDelete, [idOrders], (err, results2) => {
                        if(err){
                            return next(err)
                        }else{
                        var sql = "DELETE FROM `jaw-app`.`Orders` WHERE idOrders=?"
                        connection.query(sql,[idOrders] , (err, results3) => {
                        if(err){
                            return next(err)
                        }else{
                            res.json({
                                success: "success",
                                message: results3,
                                message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย"
                            })
                        }
                    })
                        }
                    })
            }else{
                var sql2 = "DELETE FROM `jaw-app`.`Orders` WHERE idOrders=?"
                        connection.query(sql2,[idOrders] , (err, results4) => {
                        if(err){
                            return next(err)
                        }else{
                            res.json({
                                success: "success",
                                message: results4,
                                message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย"
                            })
                        }
                    })
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
        WHERE Orders.idOrders = RealTimeOrder.idOrder  AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.timestamp DESC"
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
    console.log(body)
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var sql ="INSERT INTO `jaw-app`.`testResults` \
         ( `Recheck`, `idSpfChem`, \
        `Tn`, `PH`, `Salt`, `Tss`, \
        `Histamine`, `SPGTest`, `Aw`, \
        `idSpfMicro`, `APC`, \
        `Yeasts`, `EColi`, `Coliform`, \
        `Saureus`, `idOrderTested`, `tempPH` ,`tempAW` ,`tempTss` ,`tempSPG` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? ) ; "
         connection.query(sql, [ Recheck, idSpfChem, Tn,
        PH, Salt, Tss, Histamine, SPG, Aw, idSpfMicro, APC, Yeasts, EColi, Coliform,
        Saureus, idOrders, TempPH , TempAW , TempTSS, TempSPG
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
            //TN
            if(index.Tn >= index.TnMain && index.Tn <= index.TnMax ){
                let tnn = {
                    int:true , coa:true , val:index.Tn, valTn:index.Tn , key:'TN(g/L)' , temp:false , keyInput:"Tn" 
                }
                TestedIndex.push(tnn)
            }else{
                let tnn = {
                    int:false , coa:false, val:index.Tn, valTn:index.Tn , key:'TN(g/L)' , temp:false , keyInput:"Tn" 
                }
                TestedIndex.push(tnn)
            }
            //Salt
            if(index.Salt >= index.SaltControlMin && index.Salt <= index.SaltCOAMax ){
                if(index.Salt <= index.SaltCOAMin){
                let Salt = {
                    int:true , coa:true, val:index.SaltCOAMin, valSalt:index.SaltCOAMin , key:'%Salt(w/v)' , temp:false ,keyInput:"Salt"
                }
                TestedIndex.push(Salt) 
                }else{
                    let Salt = {
                        int:true , coa:true, val:index.Salt, valSalt:index.Salt , key:'%Salt(w/v)' , temp:false ,keyInput:"Salt"
                    }
                    TestedIndex.push(Salt) 
                }
            }else{
                let Salt = {
                    int:false , coa:false, val:index.Salt, valSalt:index.Salt ,  key:'%Salt(w/v)' , temp:false ,keyInput:"Salt"
                }
                TestedIndex.push(Salt)
            }
            //Histamine
            console.log('index.Histamine : ', index.Histamine)
            if(index.Histamine == null){
                let His = {
                    int:false , coa:false , val:index.Histamine, valHistamine:index.Histamine , key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine"
                }
                TestedIndex.push(His)
            }else if(index.Histamine >= index.HistamineMin && index.Histamine <= index.HistamineMax){
                let His = {
                    int:true , coa:true , val:index.Histamine, valHistamine:index.Histamine, key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine"
                }
                TestedIndex.push(His)
            }else{
                let His = {
                    int:false , coa:false , val:index.Histamine, valHistamine:index.Histamine , key:'Histamine(ppm)' , temp:false ,keyInput:"Histamine"
                }
                TestedIndex.push(His)
            }
            //PH
            if(index.PH >= index.PHControlMin && index.PH <= index.PHCOAMax ){
                if(index.PH <= index.PHCOAMin){
                    let phh = {
                        int:true , coa:true, val:index.PHCOAMin, valPH:index.PHCOAMin ,  key:'PH' , temp:index.tempPH , keyInput:"PH" , keyTemp:'tempPH'
                    }
                    TestedIndex.push(phh)
                }else{
                    let phh = {
                        int:true , coa:true, val:index.PH, valPH:index.PH, key:'PH' ,  temp:index.tempPH , keyInput:"PH", keyTemp:'tempPH'
                }
                TestedIndex.push(phh)
                }
            }else{
                let phh = {
                    int:false , coa:false, val:index.PH, valPH:index.PH  , key:'PH' , temp:index.tempPH , keyInput:"PH", keyTemp:'tempPH'
                }
                TestedIndex.push(phh)
            }
            //AW
            if(index.Aw >= index.AWMin && index.Aw <= index.AWMax){
                let Aw = {
                    int:true , coa:true , val:index.Aw, valAw:index.Aw , key:'Aw', temp:index.tempAW ,keyInput:"Aw", keyTemp:'tempAW'
                }
                TestedIndex.push(Aw)
            }else{
                let Aw = {
                    int:false , coa:false , val:index.Aw, valAw:index.Aw , key:'Aw', temp:index.tempAW ,keyInput:"Aw", keyTemp:'tempAW'
                }
                TestedIndex.push(Aw)
            }
            //TSS
            if(index.Tss >= index.TSSMin && index.Tss <= index.TSSMax){
                let Tss = {
                    int:true , coa:true , val:index.Tss, valTss:index.Tss ,key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'tempTSS'
                }
                TestedIndex.push(Tss)
            }else if(index.Tss == null){
                let Tss = {
                    int:true , coa:true , val:null, valTss:null, key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'tempTSS'
                }
                TestedIndex.push(Tss)
            }else{
                let Tss = {
                    int:false , coa:false , val:index.Tss, valTss:index.Tss ,key:'Tss(Brix)', temp:index.tempTSS ,keyInput:"Tss" , keyTemp:'tempTSS'
                }
                TestedIndex.push(Tss)
            }
            //SPG
            //console.log(index.SPGTest)
            if(index.SPGTest > 0 && index.SPGTest < index.SPG){
                let spg = {
                    int:true , coa:true , val:index.SPGTest, valSPG:index.SPGTest ,key:'SPG', temp:index.tempSPG ,keyInput:"SPG" , keyTemp:'tempSPG'
                }
                TestedIndex.push(spg)
            }else{
                let spg = {
                    int:false , coa:false , val:index.SPGTest, valSPG:index.SPGTest, key:'SPG', temp:index.tempSPG ,keyInput:"SPG" , keyTemp:'tempSPG'
                }
                TestedIndex.push(spg)
            }

            var bio = [] 
            // APC
            if(index.APC > index.APCMin && index.APC < index.APCMax){
                let apc = {
                    int:true , coa:true , val:index.APC, key:'APC'
                }
                bio.push(apc)
            }else{
                let apc = {
                    int:false , coa:false , val:index.APC, key:'APC'
                }
                bio.push(apc)
            }
            // Yeasts & Molds
            if(index.Yeasts > index.YeastsMin && index.Yeasts < index.YeastsMax){
                let Yeasts = {
                    int:true , coa:true , val:index.Yeasts, key:'Yeasts & Molds'
                }
                bio.push(Yeasts)
            }else{
                let Yeasts = {
                    int:false , coa:false , val:index.Yeasts, key:'Yeasts & Molds'
                }
                bio.push(Yeasts)
            }
            // E. coil
            if(index.EColi > index.EColiMin && index.EColi < index.EColiMax){
                let EColi = {
                    int:true , coa:true , val:index.EColi, key:'E. coil'
                }
                bio.push(EColi)
            }else{
                let EColi = {
                    int:false , coa:false , val:index.EColi, key:'E. coil'
                }
                bio.push(EColi)
            }
            // Coliform
            if(index.Coliform > index.ColiformMin && index.Coliform < index.ColiformMax){
                let Coliform = {
                    int:true , coa:true , val:index.Coliform, key:'Coliform'
                }
                bio.push(Coliform)
            }else{
                let Coliform = {
                    int:false , coa:false , val:index.Coliform, key:'Coliform'
                }
                bio.push(Coliform)
            }
            // S. aureus
            if(index.Saureus > index.SaureusMin && index.Saureus < index.SaureusMax){
                let Saureus = {
                    int:true , coa:true , val:index.Saureus, key:'S. aureus'
                }
                bio.push(Saureus)
            }else{
                let Saureus = {
                    int:false , coa:false , val:index.Saureus, key:'S. aureus'
                }
                bio.push(Saureus)
            }
            results.push(TestedIndex, bio)
            console.log('index : ', index)

            return(results)
            
    }else{
        return(null)
    }
    
}

exports.readTestReportlasted = (req, res, next) => {
    var {
        body
    } = req;
    console.log(body)
    var idOrders    = body.idOrders
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `jaw-app`.testResults, `jaw-app`.PdSpecificChem  , `jaw-app`.PdSpecificMicro \
         WHERE testResults.idOrderTested = ? AND testResults.idSpfChem = PdSpecificChem.idPdSpecificChem  ORDER BY testResults.timestamp DESC LIMIT 1;"
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
                    var resultTested = testResult(results[0])
                    console.log('resultTested : ',resultTested)
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

