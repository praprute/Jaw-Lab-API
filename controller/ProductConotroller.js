const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const config = require("./../config");
const { connect } = require("pm2");
const imageToBase64 = require("image-to-base64");
var request = require("request");
const tokenLineLab = "5utV0rqbi4biDTTFGi2YEeBOCIoVFVlaa8UKvP06iRf";
const tokenLineProduction = "4NDaXviNWZub9nXzKHPwnKSt07xAmG4aqOLwNzlHhjd";
require("dotenv").config();

exports.addOrder = (req, res, next) => {
  var { body } = req;

  var pord = body.PORD;
  var bbe = body.BBE;
  var po = body.PO;
  var productname = body.ProductName;
  var size = body.Size;
  var quantity = body.Quantity;
  var idchem = body.idScfChem;
  var idmicro = body.idScfMicro;
  var priority = body.Priority;

  var Tn = body.Tn;
  var PH = body.PH;
  var Salt = body.Salt;
  var Tss = body.Tss;
  var Histamine = body.Histamine;
  var SPG = body.Spg;
  var Aw = body.Aw;
  var Gluten = body.Gluten;

  var AN = body.AN;
  var Acidity = body.Acidity;
  var Viscosity = body.Viscosity;
  var SaltMeter = body.SaltMeter;
  var Color = body.Color;

  var Micro = body.Micro;

  const ref = body.ref;

  var ChemResponseLine = [
    { component: "Tn", value: body.Tn },
    { component: "PH", value: body.PH },
    { component: "Salt", value: body.Salt },
    { component: "Tss", value: body.Tss },
    { component: "Histamine", value: body.Histamine },
    { component: "SPG", value: body.Spg },
    { component: "Aw", value: body.Aw },
    { component: "AN", value: body.AN },
    { component: "Acidity", value: body.Acidity },
    { component: "Viscosity", value: body.Viscosity },
    { component: "Salt Meter", value: body.SaltMeter },
    { component: "Color", value: body.Color },
    { component: "Gluten", value: body.Gluten },
  ];

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "INSERT INTO `" +
      process.env.DB_NAME +
      "`.`Orders` ( PORD, BBE, PO, ProductName, Size, Quantity , idScfChem, idScfMicro, Priority, Tn, PH, Salt, Tss , Histamine, Spg, Aw, Micro, AN, Acidity, Viscosity, SaltMeter, Color, Gluten) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?, ?, ?, ?, ? , ?, ?)";
    connection.query(
      sql,
      [
        pord,
        bbe,
        po,
        productname,
        size,
        quantity,
        idchem,
        idmicro,
        priority,
        Tn,
        PH,
        Salt,
        Tss,
        Histamine,
        SPG,
        Aw,
        Micro,
        AN,
        Acidity,
        Viscosity,
        SaltMeter,
        Color,
        Gluten
      ],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          var idOrders = results.insertId;
          req.getConnection((err, connection) => {
            if (err) return next(err);

            var sql =
              "INSERT INTO `" +
              process.env.DB_NAME +
              "`.`testResults` \
                     ( `Recheck`, `idSpfChem`, \
                    `Tn`, `PH`, `Salt`, `Tss`, \
                    `Histamine`, `SPGTest`, `Aw`, `AN`, `Acidity`, `Viscosity`,`SaltMeter`, `Color` , `idSpfMicro`, `APC`, \
                    `Yeasts`, `EColi`, `Coliform`, \
                    `Saureus`, `idOrderTested`, `tempPH` ,`tempAW` ,`tempTss` ,`tempSPG`,  `TnC`, `PHC`, `SaltC`, `TssC`, `HistamineC`, `SpgC`, `AwC`, `MicroC`, `ANC`, `AcidityC`, `ViscosityC`, `SaltMeterC`, `ColorC`, `ref`, `Gluten`,`GlutenC` ) VALUES ( ?,?,?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ; ";
            connection.query(
              sql,
              [
                0,
                idchem,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                idmicro,
                null,
                null,
                null,
                null,
                null,
                idOrders,
                null,
                null,
                null,
                null,
                Tn,
                PH,
                Salt,
                Tss,
                Histamine,
                SPG,
                Aw,
                Micro,
                AN,
                Acidity,
                Viscosity,
                SaltMeter,
                Color,
                !!ref ? ref : null,
                null,
                Gluten
              ],
              (err, results) => {
                if (err) {
                  return next(err);
                } else {
                  console.log('results : ', results)
                  req.getConnection((err, connection) => {
                    if (err) next(err);

                    var sqlLine =
                      " SELECT name FROM `" +
                      process.env.DB_NAME +
                      "`.PdSpecificChem where idPdSpecificChem = ? ";
                    connection.query(sqlLine, [idchem], (err, results3) => {
                      if (err) {
                        return next(err);
                      } else {
                        res.json({
                          success: "success",
                          idAddOrder: idOrders,
                          message_th: "ทำการเพิ่ม order ลงรายงการเรียบร้อย",
                        });

                        let messageSampleObject = [];
                        for (let i = 0; i < ChemResponseLine.length; i++) {
                          if (ChemResponseLine[i].value == true) {
                            messageSampleObject.push(
                              ChemResponseLine[i].component
                            );
                          }
                        }
                        //real request
                        request(
                          {
                            method: "POST",
                            uri: "https://notify-api.line.me/api/notify",
                            headers: {
                              "Content-Type":
                                "application/x-www-form-urlencoded",
                            },
                            auth: {
                              bearer: tokenLineLab,
                            },
                            form: {
                              message: `มีการส่งตัวอย่างชื่อ ${productname} สูตร ${JSON.stringify(
                                results3[0].name
                              )} ต้องทำการตรวจวัด ${messageSampleObject
                                .toString()
                                .trim()} `,
                            },

                            // ==> เวียดฮง
                          },
                          (err, httpResponse, body) => {
                            if (err) {
                              console.log(err);
                            } else {
                            }
                          }
                        );
                      }
                    });
                  });
                }
              }
            );
          });
        }
      }
    );
  });
};

exports.updateOrder = (req, res, next) => {
  var { body } = req;

  var pord = body.PORD;
  var bbe = body.BBE;
  var po = body.PO;
  var productname = body.ProductName;
  var size = body.Size;
  var quantity = body.Quantity;
  var idchem = body.idScfChem;
  var idmicro = body.idScfMicro;
  var priority = body.Priority;
  var idOrders = body.idOrders;

  var Tn = body.Tn;
  var PH = body.PH;
  var Salt = body.Salt;
  var Tss = body.Tss;
  var Histamine = body.Histamine;
  var SPG = body.Spg;
  var Aw = body.Aw;
  var Gluten = body.Gluten
  var Micro = body.Micro;

  var AN = body.AN;
  var Acidity = body.Acidity;
  var Viscosity = body.Viscosity;

  var SaltMeter = body.SaltMeter;
  var Color = body.Color;
  var tricker = body.tricker;
  if (tricker == true) {
    req.getConnection((err, connection) => {
      if (err) return next(err);

      var sql =
        "UPDATE `" +
        process.env.DB_NAME +
        "`.`Orders` SET  PORD=?, BBE=?, PO=?, ProductName=?, Size=?, Quantity=?, idScfChem=?, idScfMicro=?, Priority=? ,Tn=? , PH =? , Salt=?, Tss=?, Histamine=?, Spg=?, Aw=? ,Micro=? ,\
        AN=?, Acidity=?, Viscosity=?, SaltMeter=? , Color=? , Status=0, Gluten=? WHERE idOrders=?";
      connection.query(
        sql,
        [
          pord,
          bbe,
          po,
          productname,
          size,
          quantity,
          idchem,
          idmicro,
          priority,
          Tn,
          PH,
          Salt,
          Tss,
          Histamine,
          SPG,
          Aw,
          Micro,
          AN,
          Acidity,
          Viscosity,
          SaltMeter,
          Color,
          Gluten,
          idOrders,
        ],
        (err, results) => {
          if (err) {
            return next(err);
          } else {
            var sql2 =
              "UPDATE `" +
              process.env.DB_NAME +
              "`.`testResults` SET  \
                            TnC = ? , PHC =? , SaltC = ? , TssC = ?, \
                            HistamineC = ? , SpgC = ?, AwC = ?, ANC = ?, AcidityC = ?, ViscosityC = ?, SaltMeterC = ?, ColorC = ? ,MicroC=?, GlutenC=? WHERE idOrderTested = ? ";
            connection.query(
              sql2,
              [
                Tn,
                PH,
                Salt,
                Tss,
                Histamine,
                SPG,
                Aw,
                AN,
                Acidity,
                Viscosity,
                SaltMeter,
                Color,
                Micro,
                Gluten,
                idOrders,
              ],
              (err, results) => {
                if (err) {
                  return next(err);
                } else {
                  request(
                    {
                      method: "POST",
                      uri: "https://notify-api.line.me/api/notify",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      auth: {
                        bearer: tokenLineLab,
                      },
                      form: {
                        message: `${productname} : มีการแก้ไขการส่งตัวอย่างต้องทำการตรวจวัดเพิ่มเติม`,
                      },
                    },
                    (err, httpResponse, body) => {
                      if (err) {
                        console.log(err);
                      } else {
                      }
                    }
                  );
                  res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย",
                  });
                }
              }
            );
          }
        }
      );
    });
  } else {
    req.getConnection((err, connection) => {
      if (err) return next(err);

      var sql =
        "UPDATE `" +
        process.env.DB_NAME +
        "`.`Orders` SET  PORD=?, BBE=?, PO=?, ProductName=?, Size=?, Quantity=?, idScfChem=?, idScfMicro=?, Priority=? ,Tn=? , PH =? , Salt=?, Tss=?, Histamine=?, Spg=?, Aw=? ,Micro=? ,\
        AN=?, Acidity=?, Viscosity=?, SaltMeter=? , Color=?, Gluten=? WHERE idOrders=?";
      connection.query(
        sql,
        [
          pord,
          bbe,
          po,
          productname,
          size,
          quantity,
          idchem,
          idmicro,
          priority,
          Tn,
          PH,
          Salt,
          Tss,
          Histamine,
          SPG,
          Aw,
          Micro,
          AN,
          Acidity,
          Viscosity,
          SaltMeter,
          Color,
          Gluten,
          idOrders,
        ],
        (err, results) => {
          if (err) {
            return next(err);
          } else {
            var sql2 =
              "UPDATE `" +
              process.env.DB_NAME +
              "`.`testResults` SET  \
                            TnC = ? , PHC =? , SaltC = ? , TssC = ?, \
                            HistamineC = ? , SpgC = ?, AwC = ?, ANC = ?, AcidityC = ?, ViscosityC = ?, SaltMeterC = ?, ColorC = ? ,MicroC=?,  GlutenC=? WHERE idOrderTested = ? ";
            connection.query(
              sql2,
              [
                Tn,
                PH,
                Salt,
                Tss,
                Histamine,
                SPG,
                Aw,
                AN,
                Acidity,
                Viscosity,
                SaltMeter,
                Color,
                Micro,
                Gluten,
                idOrders,
              ],
              (err, results) => {
                if (err) {
                  return next(err);
                } else {
                  res.json({
                    success: "success",
                    message: results,
                    message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย",
                  });
                }
              }
            );
          }
        }
      );
    });
  }
};

exports.reSend = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;
  var ProductName = body.ProductName;
  var Spc = body.Spc;
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET  Status=0 WHERE idOrders = ?";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย",
        });
        //real request
        request(
          {
            method: "POST",
            uri: "https://notify-api.line.me/api/notify",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
              bearer: tokenLineLab,
            },
            form: {
              message: `Resend from production order ${ProductName} specific ${Spc} `,
            },
          },
          (err, httpResponse, body) => {
            if (err) {
              console.log(err);
            } else {
            }
          }
        );
      }
    });
  });
};

exports.deleteOrder = (req, res, next) => {
  var { body } = req;
  // console.log('deleteOrder : ' ,body)

  var idOrders = body.idOrders;
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var CheckReaTimeOrder =
      "SELECT*FROM `" + process.env.DB_NAME + "`.RealTimeOrder WHERE idOrder=?";
    connection.query(CheckReaTimeOrder, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        if (results.length > 0) {
          var sqlDeleteRealTime =
            "DELETE FROM `" +
            process.env.DB_NAME +
            "`.`RealTimeOrder` WHERE idOrder=?";
          connection.query(sqlDeleteRealTime, [idOrders], (err, results2) => {
            if (err) {
              return next(err);
            } else {
              var Checktested =
                "SELECT*FROM `" +
                process.env.DB_NAME +
                "`.testResults WHERE idOrderTested=?";
              connection.query(Checktested, [idOrders], (err, results3) => {
                if (err) {
                  return next(err);
                } else {
                  if (results3.length > 0) {
                    var sqlTestDelete =
                      "DELETE FROM `" +
                      process.env.DB_NAME +
                      "`.testResults WHERE idOrderTested=?";
                    connection.query(
                      sqlTestDelete,
                      [idOrders],
                      (err, results4) => {
                        if (err) {
                          return next(err);
                        } else {
                          var sql =
                            "DELETE FROM `" +
                            process.env.DB_NAME +
                            "`.`Orders` WHERE idOrders=?";
                          connection.query(sql, [idOrders], (err, results5) => {
                            if (err) {
                              return next(err);
                            } else {
                              res.json({
                                success: "success",
                                message: results5,
                                message_th:
                                  "ทำการลบข้อมูล order ลงรายงการเรียบร้อย",
                              });
                            }
                          });
                        }
                      }
                    );
                  } else {
                    var sql =
                      "DELETE FROM `" +
                      process.env.DB_NAME +
                      "`.`Orders` WHERE idOrders=?";
                    connection.query(sql, [idOrders], (err, results6) => {
                      if (err) {
                        return next(err);
                      } else {
                        res.json({
                          success: "success",
                          message: results6,
                          message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย",
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          var sql =
            "DELETE FROM `" +
            process.env.DB_NAME +
            "`.`Orders` WHERE idOrders=?";
          connection.query(sql, [idOrders], (err, results7) => {
            if (err) {
              return next(err);
            } else {
              res.json({
                success: "success",
                message: results7,
                message_th: "ทำการลบข้อมูล order ลงรายงการเรียบร้อย",
              });
            }
          });
        }
      }
    });
  });
};

exports.readAllOrder = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `" +
      process.env.DB_NAME +
      "`.Orders, \
        `" +
      process.env.DB_NAME +
      "`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.timestamp DESC";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readOrdertoCheck = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `" +
      process.env.DB_NAME +
      "`.Orders, \
        `" +
      process.env.DB_NAME +
      "`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.Priority DESC";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.urgentOrders = (req, res, next) => {
  var { body } = req;

  priority = body.Priority;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT Orders.idOrders, Orders.PORD ,  Orders.BBE, Orders.ProductName , Orders.Priority , Orders.Recheck , \
        Orders.PO , Orders.Status , Orders.Size , Orders.Quantity , Orders.idScfChem , Orders.idScfMicro , Orders.timestamp , PdSpecificChem.name FROM `" +
      process.env.DB_NAME +
      "`.Orders, \
        `" +
      process.env.DB_NAME +
      "`.PdSpecificChem  WHERE Orders.idScfChem = PdSpecificChem.idPdSpecificChem AND Orders.Priority = ? ORDER BY Orders.timestamp DESC";
    connection.query(sql, [priority], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.dailyReport = async (req, res, next) => {
  var { body } = req;
  let ds = body.dStart;
  let de = body.dNow;
  await req.getConnection(async (err, connection) => {
    if (err) return next(err);
    var sql =
      "SELECT testResults.*,Orders.ProductName , Orders.idOrders FROM `" +
      process.env.DB_NAME +
      "`.testResults INNER JOIN `" +
      process.env.DB_NAME +
      "`.Orders ON testResults.idOrderTested = Orders.idOrders where testResults.timestampTest BETWEEN ? AND ? ;";
    await connection.query(
      sql,
      [`${ds.toString()}`, `${de.toString()}`],
      async (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
            message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
          });
        }
      }
    );
  });
};

exports.readRealTimeOrder = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT * FROM `" +
      process.env.DB_NAME +
      "`.Orders,`" +
      process.env.DB_NAME +
      "`.RealTimeOrder ,`" +
      process.env.DB_NAME +
      "`.PdSpecificChem \
        WHERE Orders.idOrders = RealTimeOrder.idOrder  AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem ORDER BY Orders.timestamp DESC LIMIT 5";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};
exports.addRealTimeOrder = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "INSERT INTO `" +
      process.env.DB_NAME +
      "`.RealTimeOrder (`idOrder`) VALUES (?);";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readRecheckOrder = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "select * from `" +
      process.env.DB_NAME +
      "`.Orders, `" +
      process.env.DB_NAME +
      "`.PdSpecificChem \
         where Orders.Recheck > 0 AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem  ORDER BY Orders.timestamp DESC";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.realTimeTable = () => {};

exports.readOrderById = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT*FROM `" +
      process.env.DB_NAME +
      "`.`Orders`, `" +
      process.env.DB_NAME +
      "`.`PdSpecificChem` WHERE idOrders = ? AND Orders.idScfChem = PdSpecificChem.idPdSpecificChem";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readOrderByRef = (req, res, next) => {
  var { body } = req;

  const ref = body.ref;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT*FROM `" +
      process.env.DB_NAME +
      "`.`testResults` " + " WHERE ref = ? ;";
    connection.query(sql, [ref], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};


exports.readAllSpecificChem = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql = "SELECT*FROM `" + process.env.DB_NAME + "`.`PdSpecificChem`";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readAllSpecificMicro = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql = "SELECT*FROM `" + process.env.DB_NAME + "`.`PdSpecificMicro`";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readIdChem = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT idPdSpecificChem ,name FROM `" +
      process.env.DB_NAME +
      "`.PdSpecificChem;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล Spc Chem => id, Name",
        });
      }
    });
  });
};

exports.readIdMicro = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT idPdSpecificMicro ,name FROM `" +
      process.env.DB_NAME +
      "`.PdSpecificMicro;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูล Spc Chem => id, Name",
        });
      }
    });
  });
};

exports.readAllSpecificChemById = (req, res, next) => {
  var { body } = req;
  var idPdSpecificChem = body.idPdSpecificChem;
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT*FROM `" +
      process.env.DB_NAME +
      "`.`PdSpecificChem` WHERE idPdSpecificChem = ?";
    connection.query(sql, [idPdSpecificChem], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูลสูตรน้ำปลาเรียบร้อย",
        });
      }
    });
  });
};

exports.readAllSpecificBioById = (req, res, next) => {
  var { body } = req;
  var idPdSpecificMicro = body.idPdSpecificMicro;
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT*FROM `" +
      process.env.DB_NAME +
      "`.`PdSpecificMicro` WHERE idPdSpecificMicro = ?";
    connection.query(sql, [idPdSpecificMicro], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการอ่านข้อมูลสูตรน้ำปลาเรียบร้อย",
        });
      }
    });
  });
};

exports.addSpecificChem = (req, res, next) => {
  var { body } = req;

  var name = body.name;
  var TnMain = body.TnMain;
  var TnMax = body.TnMax;
  var PHControlMin = body.PHControlMin;
  var PHControlMax = body.PHControlMax;
  var PHCOAMin = body.PHCOAMin;
  var PHCOAMax = body.PHCOAMax;
  var SaltControlMin = body.SaltControlMin;
  var SaltControlMax = body.SaltControlMax;
  var SaltCOAMin = body.SaltCOAMin;
  var SaltCOAMax = body.SaltCOAMax;
  var TSSMin = body.TSSMin;
  var TSSMax = body.TSSMax;
  var HistamineMin = body.HistamineMin;
  var HistamineMax = body.HistamineMax;
  var SPG = body.SPG;
  var AWMin = body.AWMin;
  var AWMax = body.AWMax;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT `" +
      process.env.DB_NAME +
      "`.`PdSpecificChem`.name FROM `" +
      process.env.DB_NAME +
      "`.PdSpecificChem WHERE name=?";
    connection.query(sql, [name], (err, results) => {
      if (err) {
        return next(err);
      } else {
        if (results.length > 0) {
          res.json({
            success: "error",
            message: results,
            message_th: "Specific Chem has duplicate",
          });
        } else {
          var sqlInsertSpecific =
            "INSERT INTO `" +
            process.env.DB_NAME +
            "`.`PdSpecificChem` ( name ,\
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
                        AWMax           ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        }
        connection.query(
          sqlInsertSpecific,
          [
            name,
            TnMain,
            TnMax,
            PHControlMin,
            PHControlMax,
            PHCOAMin,
            PHCOAMax,
            SaltControlMin,
            SaltControlMax,
            SaltCOAMin,
            SaltCOAMax,
            TSSMin,
            TSSMax,
            HistamineMin,
            HistamineMax,
            SPG,
            AWMin,
            AWMax,
          ],
          (err, resultsInsert) => {
            if (err) {
              return next(err);
            } else {
              res.json({
                success: "success",
                message: resultsInsert,
                message_th: "Add Specific Chem Success",
              });
            }
          }
        );
      }
    });
  });
};

exports.updateSpecificChem = (req, res, next) => {
  var { body } = req;

  var idPdSpecificChem = body.idPdSpecificChem;
  var name = body.name;
  var TnMain = body.TnMain;
  var TnMax = body.TnMax;
  var PHControlMin = body.PHControlMin;
  var PHControlMax = body.PHControlMax;
  var PHCOAMin = body.PHCOAMin;
  var PHCOAMax = body.PHCOAMax;
  var SaltControlMin = body.SaltControlMin;
  var SaltControlMax = body.SaltControlMax;
  var SaltCOAMin = body.SaltCOAMin;
  var SaltCOAMax = body.SaltCOAMax;
  var TSSMin = body.TSSMin;
  var TSSMax = body.TSSMax;
  var HistamineMin = body.HistamineMin;
  var HistamineMax = body.HistamineMax;
  var SPG = body.SPG;
  var AWMin = body.AWMin;
  var AWMax = body.AWMax;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`PdSpecificChem` SET  name =? ,\
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
            AWMax=?   WHERE idPdSpecificChem = ?";
    connection.query(
      sql,
      [
        name,
        TnMain,
        TnMax,
        PHControlMin,
        PHControlMax,
        PHCOAMin,
        PHCOAMax,
        SaltControlMin,
        SaltControlMax,
        SaltCOAMin,
        SaltCOAMax,
        TSSMin,
        TSSMax,
        HistamineMin,
        HistamineMax,
        SPG,
        AWMin,
        AWMax,
        idPdSpecificChem,
      ],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
            message_th: "Update Specific Chem Success",
          });
        }
      }
    );
  });
};

exports.DeleteSpecificChemById = (req, res, next) => {
  var { body } = req;
  var idPdSpecificChem = body.idPdSpecificChem;
  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "DELETE FROM `" +
      process.env.DB_NAME +
      "`.`PdSpecificChem` WHERE idPdSpecificChem = ?";
    connection.query(sql, [idPdSpecificChem], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการลบสูตรน้ำปลาเรียบร้อย",
        });
      }
    });
  });
};

exports.Addtestreport = (req, res, next) => {
  var { body } = req;
  var idOrders = body.idOrders;
  var PORD = body.PORD;
  var BBE = body.BBE;
  var PO = body.PO;
  var ProductName = body.ProductName;
  var Recheck = body.Recheck;
  var Size = body.Size;
  var Quantity = body.Quantity;
  var idSpfChem = body.idSpfChem;
  var Tn = body.Tn;
  var PH = body.PH;
  var Salt = body.Salt;
  var Tss = body.Tss;
  var Histamine = body.Histamine;
  var SPG = body.SPG;
  var Aw = body.Aw;
  var AN = body.AN;
  var Acidity = body.Acidity;
  var Viscosity = body.Viscosity;
  var SaltMeter = body.SaltMeter;
  var Color = body.Color;
  var Gluten = body.Gluten;

  var idSpfMicro = body.idSpfMicro;
  var APC = body.APC;
  var Yeasts = body.Yeasts;
  var EColi = body.EColi;
  var Coliform = body.Coliform;
  var Saureus = body.Saureus;
  var TempPH = body.TempPH;
  var TempAW = body.TempAW;
  var TempTSS = body.TempTSS;
  var TempSPG = body.TempSPG;
  var timeStamp = body.timeStamp;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`testResults` SET Recheck = ?, idSpfChem = ?, \
        Tn = ? , PH =? , Salt = ? , Tss = ?, \
        Histamine = ? , SPGTest = ?, Aw = ?, \
        idSpfMicro = ?, APC = ?, \
        Yeasts = ?, EColi = ?, Coliform = ? , \
        Saureus = ? , tempPH = ? , tempAW = ? , tempTss = ?  , tempSPG = ? , AN = ?, Acidity = ?, Viscosity = ?, SaltMeter=?, Color=? , timestampTest=?, Gluten=? WHERE idOrderTested = ? ";
    connection.query(
      sql,
      [
        Recheck,
        idSpfChem,
        Tn,
        PH,
        Salt,
        Tss,
        Histamine,
        SPG,
        Aw,
        idSpfMicro,
        APC,
        Yeasts,
        EColi,
        Coliform,
        Saureus,
        TempPH,
        TempAW,
        TempTSS,
        TempSPG,
        AN,
        Acidity,
        Viscosity,
        SaltMeter,
        Color,
        timeStamp,
        Gluten,
        idOrders,
      ],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
            message_th: "Add Specific Chem Success",
          });
        }
      }
    );
  });
};

function testResult(index) {
  // console.log('testResult ', index.timestampTest);
  if (index) {
    var results = [];
    var TestedIndex = [];
    var TimeToTest = [];
    //TN
    if (index.Tn == null) {
      let tnn = {
        render: index.TnC,
        int: false,
        coa: false,
        val: index.Tn,
        valTn: index.Tn,
        key: "TN(g/L)",
        temp: false,
        keyInput: "Tn",
        tkTemp: false,
      };
      TestedIndex.push(tnn);
    } else if (index.Tn >= index.TnMain && index.Tn <= index.TnMax) {
      let tnn = {
        render: index.TnC,
        int: true,
        coa: true,
        val: index.Tn,
        valTn: index.Tn,
        key: "TN(g/L)",
        temp: false,
        keyInput: "Tn",
        tkTemp: false,
      };
      TestedIndex.push(tnn);
    } else {
      let tnn = {
        render: index.TnC,
        int: false,
        coa: false,
        val: index.Tn,
        valTn: index.Tn,
        key: "TN(g/L)",
        temp: false,
        keyInput: "Tn",
        tkTemp: false,
      };
      TestedIndex.push(tnn);
    }

    //Salt
    if (index.Salt == null) {
      let Salt = {
        render: index.SaltC,
        int: false,
        coa: false,
        val: index.Salt,
        valSalt: index.Salt,
        key: "%Salt(w/v)",
        temp: false,
        keyInput: "Salt",
        tkTemp: false,
      };
      TestedIndex.push(Salt);
    } else if (
      index.Salt >= index.SaltControlMin &&
      index.Salt <= index.SaltCOAMax
    ) {
      if (index.Salt <= index.SaltCOAMin) {
        let Salt = {
          render: index.SaltC,
          int: true,
          coa: true,
          val: index.SaltCOAMin,
          valSalt: index.SaltCOAMin,
          key: "%Salt(w/v)",
          temp: false,
          keyInput: "Salt",
          tkTemp: false,
        };
        TestedIndex.push(Salt);
      } else {
        let Salt = {
          render: index.SaltC,
          int: true,
          coa: true,
          val: index.Salt,
          valSalt: index.Salt,
          key: "%Salt(w/v)",
          temp: false,
          keyInput: "Salt",
          tkTemp: false,
        };
        TestedIndex.push(Salt);
      }
    } else {
      let Salt = {
        render: index.SaltC,
        int: false,
        coa: false,
        val: index.Salt,
        valSalt: index.Salt,
        key: "%Salt(w/v)",
        temp: false,
        keyInput: "Salt",
        tkTemp: false,
      };
      TestedIndex.push(Salt);
    }

    //Histamine
    //console.log('index.Histamine : ', index.Histamine)
    if (index.Histamine == null) {
      let His = {
        render: index.HistamineC,
        int: false,
        coa: false,
        val: index.Histamine,
        valHistamine: index.Histamine,
        key: "Histamine(ppm)",
        temp: false,
        keyInput: "Histamine",
        tkTemp: false,
      };
      TestedIndex.push(His);
    } else if (
      index.Histamine >= index.HistamineMin &&
      index.Histamine <= index.HistamineMax
    ) {
      let His = {
        render: index.HistamineC,
        int: true,
        coa: true,
        val: index.Histamine,
        valHistamine: index.Histamine,
        key: "Histamine(ppm)",
        temp: false,
        keyInput: "Histamine",
        tkTemp: false,
      };
      TestedIndex.push(His);
    } else {
      let His = {
        render: index.HistamineC,
        int: false,
        coa: false,
        val: index.Histamine,
        valHistamine: index.Histamine,
        key: "Histamine(ppm)",
        temp: false,
        keyInput: "Histamine",
        tkTemp: false,
      };
      TestedIndex.push(His);
    }
    //PH
    if (index.PH == null) {
      let phh = {
        render: index.PHC,
        int: false,
        coa: false,
        val: index.PH,
        valPH: index.PH,
        key: "PH",
        temp: index.tempPH,
        keyInput: "PH",
        keyTemp: "TempPH",
        tkTemp: true,
      };
      TestedIndex.push(phh);
    } else if (index.PH >= index.PHControlMin && index.PH <= index.PHCOAMax) {
      if (index.PH <= index.PHCOAMin) {
        let phh = {
          render: index.PHC,
          int: true,
          coa: true,
          val: index.PHCOAMin,
          valPH: index.PHCOAMin,
          key: "PH",
          temp: index.tempPH,
          keyInput: "PH",
          keyTemp: "TempPH",
          tkTemp: true,
        };
        TestedIndex.push(phh);
      } else {
        let phh = {
          render: index.PHC,
          int: true,
          coa: true,
          val: index.PH,
          valPH: index.PH,
          key: "PH",
          temp: index.tempPH,
          keyInput: "PH",
          keyTemp: "TempPH",
          tkTemp: true,
        };
        TestedIndex.push(phh);
      }
    } else {
      let phh = {
        render: index.PHC,
        int: false,
        coa: false,
        val: index.PH,
        valPH: index.PH,
        key: "PH",
        temp: index.tempPH,
        keyInput: "PH",
        keyTemp: "TempPH",
        tkTemp: true,
      };
      TestedIndex.push(phh);
    }
    //AW
    if (index.Aw == null) {
      let Aw = {
        render: index.AwC,
        int: false,
        coa: false,
        val: index.Aw,
        valAw: index.Aw,
        key: "Aw",
        temp: index.tempAW,
        keyInput: "Aw",
        keyTemp: "TempAW",
        tkTemp: true,
      };
      TestedIndex.push(Aw);
    } else if (index.Aw >= index.AWMin && index.Aw <= index.AWMax) {
      let Aw = {
        render: index.AwC,
        int: true,
        coa: true,
        val: index.Aw,
        valAw: index.Aw,
        key: "Aw",
        temp: index.tempAW,
        keyInput: "Aw",
        keyTemp: "TempAW",
        tkTemp: true,
      };
      TestedIndex.push(Aw);
    } else {
      let Aw = {
        render: index.AwC,
        int: false,
        coa: false,
        val: index.Aw,
        valAw: index.Aw,
        key: "Aw",
        temp: index.tempAW,
        keyInput: "Aw",
        keyTemp: "TempAW",
        tkTemp: true,
      };
      TestedIndex.push(Aw);
    }
    //TSS
    if (index.Tss == null) {
      let Tss = {
        render: index.TssC,
        int: false,
        coa: false,
        val: null,
        valTss: null,
        key: "Tss(Brix)",
        temp: index.tempTSS,
        keyInput: "Tss",
        keyTemp: "TempTSS",
        tkTemp: true,
      };
      TestedIndex.push(Tss);
    } else if (index.Tss >= index.TSSMin && index.Tss <= index.TSSMax) {
      let Tss = {
        render: index.TssC,
        int: true,
        coa: true,
        val: index.Tss,
        valTss: index.Tss,
        key: "Tss(Brix)",
        temp: index.tempTSS,
        keyInput: "Tss",
        keyTemp: "TempTSS",
        tkTemp: true,
      };
      TestedIndex.push(Tss);
    } else {
      let Tss = {
        render: index.TssC,
        int: false,
        coa: false,
        val: index.Tss,
        valTss: index.Tss,
        key: "Tss(Brix)",
        temp: index.tempTSS,
        keyInput: "Tss",
        keyTemp: "TempTSS",
        tkTemp: true,
      };
      TestedIndex.push(Tss);
    }
    //SPG
    //console.log(index.SPGTest)
    if (index.SPGTest == null) {
      let spg = {
        render: index.SpgC,
        int: false,
        coa: false,
        val: index.SPGTest,
        valSPG: index.SPGTest,
        key: "SPG",
        temp: index.tempSPG,
        keyInput: "SPG",
        keyTemp: "TempSPG",
        tkTemp: true,
      };
      TestedIndex.push(spg);
    } else if (index.SPGTest >= 0 && index.SPGTest <= index.SPG) {
      let spg = {
        render: index.SpgC,
        int: true,
        coa: true,
        val: index.SPGTest,
        valSPG: index.SPGTest,
        key: "SPG",
        temp: index.tempSPG,
        keyInput: "SPG",
        keyTemp: "TempSPG",
        tkTemp: true,
      };
      TestedIndex.push(spg);
    } else {
      let spg = {
        render: index.SpgC,
        int: false,
        coa: false,
        val: index.SPGTest,
        valSPG: index.SPGTest,
        key: "SPG",
        temp: index.tempSPG,
        keyInput: "SPG",
        keyTemp: "TempSPG",
        tkTemp: true,
      };
      TestedIndex.push(spg);
    }

    //AN
    if (index.AN == null) {
      let AN = {
        render: index.ANC,
        int: false,
        coa: false,
        val: index.AN,
        valAN: index.AN,
        key: "AN",
        temp: false,
        keyInput: "AN",
        tkTemp: false,
      };
      TestedIndex.push(AN);
    } else if (index.AN >= index.ANMin && index.AN <= index.ANMax) {
      let AN = {
        render: index.ANC,
        int: true,
        coa: true,
        val: index.AN,
        valAN: index.AN,
        key: "AN",
        temp: false,
        keyInput: "AN",
        tkTemp: false,
      };
      TestedIndex.push(AN);
    } else {
      let AN = {
        render: index.ANC,
        int: false,
        coa: false,
        val: index.AN,
        valAN: index.AN,
        key: "AN",
        temp: false,
        keyInput: "AN",
        tkTemp: false,
      };
      TestedIndex.push(AN);
    }

    console.log('index.Gluten : ', index.Gluten)
    // Gluten
    if (index.Gluten == null) {
      let Gluten = {
        render: index.GlutenC,
        int: false,
        coa: false,
        val: index.Gluten,
        valGluten: index.Gluten,
        key: "Gluten",
        temp: false,
        keyInput: "Gluten",
        tkTemp: false,
      };
      TestedIndex.push(Gluten);
    } else if (index.Gluten >= index.GlutenMin && index.Gluten <= index.GlutenMax) {
      let Gluten = {
        render: index.GlutenC,
        int: true,
        coa: true,
        val: index.Gluten,
        valGluten: index.Gluten,
        key: "Gluten",
        temp: false,
        keyInput: "Gluten",
        tkTemp: false,
      };
      TestedIndex.push(Gluten);
    } else {
      let Gluten = {
        render: index.GlutenC,
        int: false,
        coa: false,
        val: index.Gluten,
        valGluten: index.Gluten,
        key: "Gluten",
        temp: false,
        keyInput: "Gluten",
        tkTemp: false,
      };
      TestedIndex.push(Gluten);
    }

    //Acidity
    if (index.Acidity == null) {
      let Acidity = {
        render: index.AcidityC,
        int: false,
        coa: false,
        val: index.Acidity,
        valAcidity: index.Acidity,
        key: "Acidity",
        temp: false,
        keyInput: "Acidity",
        tkTemp: false,
      };
      TestedIndex.push(Acidity);
    } else if (
      index.Acidity >= index.AcidityMin &&
      index.Acidity <= index.AcidityMax
    ) {
      let Acidity = {
        render: index.AcidityC,
        int: true,
        coa: true,
        val: index.Acidity,
        valAcidity: index.Acidity,
        key: "Acidity",
        temp: false,
        keyInput: "Acidity",
        tkTemp: false,
      };
      TestedIndex.push(Acidity);
    } else {
      let Acidity = {
        render: index.AcidityC,
        int: false,
        coa: false,
        val: index.Acidity,
        valAcidity: index.Acidity,
        key: "Acidity",
        temp: false,
        keyInput: "Acidity",
        tkTemp: false,
      };
      TestedIndex.push(Acidity);
    }

    //Viscosity
    if (index.Viscosity == null) {
      let Viscosity = {
        render: index.ViscosityC,
        int: false,
        coa: false,
        val: index.Viscosity,
        valViscosity: index.Viscosity,
        key: "Viscosity",
        temp: false,
        keyInput: "Viscosity",
        tkTemp: false,
      };
      TestedIndex.push(Viscosity);
    } else if (
      index.Viscosity >= index.ViscosityMin &&
      index.Viscosity <= index.ViscosityMax
    ) {
      let Viscosity = {
        render: index.ViscosityC,
        int: true,
        coa: true,
        val: index.Viscosity,
        valViscosity: index.Viscosity,
        key: "Viscosity",
        temp: false,
        keyInput: "Viscosity",
        tkTemp: false,
      };
      TestedIndex.push(Viscosity);
    } else {
      let Viscosity = {
        render: index.ViscosityC,
        int: false,
        coa: false,
        val: index.Viscosity,
        valViscosity: index.Viscosity,
        key: "Viscosity",
        temp: false,
        keyInput: "Viscosity",
        tkTemp: false,
      };
      TestedIndex.push(Viscosity);
    }

    //SaltMeter
    if (index.SaltMeter == null) {
      let SaltMeter = {
        render: index.SaltMeterC,
        int: false,
        coa: false,
        val: index.SaltMeter,
        valSaltMeter: index.SaltMeter,
        key: "Salt Meter",
        temp: false,
        keyInput: "SaltMeter",
        tkTemp: false,
      };
      TestedIndex.push(SaltMeter);
    } else if (
      index.SaltMeter >= index.SaltMeterMin &&
      index.SaltMeter <= index.SaltMeterMax
    ) {
      let SaltMeter = {
        render: index.SaltMeterC,
        int: true,
        coa: true,
        val: index.SaltMeter,
        valSaltMeter: index.SaltMeter,
        key: "Salt Meter",
        temp: false,
        keyInput: "SaltMeter",
        tkTemp: false,
      };
      TestedIndex.push(SaltMeter);
    } else {
      let SaltMeter = {
        render: index.SaltMeterC,
        int: false,
        coa: false,
        val: index.SaltMeter,
        valSaltMeter: index.SaltMeter,
        key: "Salt Meter",
        temp: false,
        keyInput: "SaltMeter",
        tkTemp: false,
      };
      TestedIndex.push(SaltMeter);
    }

    //Color
    if (index.Color == null) {
      let Color = {
        render: index.ColorC,
        int: false,
        coa: false,
        val: index.Color,
        valColor: index.Color,
        key: "Color",
        temp: false,
        keyInput: "Color",
        tkTemp: false,
      };
      TestedIndex.push(Color);
    } else if (index.Color >= index.ColorMin && index.Color <= index.ColorMax) {
      let Color = {
        render: index.ColorC,
        int: true,
        coa: true,
        val: index.Color,
        valColor: index.Color,
        key: "Color",
        temp: false,
        keyInput: "Color",
        tkTemp: false,
      };
      TestedIndex.push(Color);
    } else {
      let Color = {
        render: index.ColorC,
        int: false,
        coa: false,
        val: index.Color,
        valColor: index.Color,
        key: "Color",
        temp: false,
        keyInput: "Color",
        tkTemp: false,
      };
      TestedIndex.push(Color);
    }

    var bio = [];
    // APC
    if (index.APC == null) {
      let apc = {
        int: false,
        coa: false,
        val: index.APC,
        key: "APC",
        keyInput: "APC",
      };
      bio.push(apc);
    } else {
      if (index.APC >= index.APCMin && index.APC <= index.APCMax) {
        let apc = {
          int: true,
          coa: true,
          val: index.APC,
          key: "APC",
          keyInput: "APC",
        };
        bio.push(apc);
      } else {
        let apc = {
          int: false,
          coa: false,
          val: index.APC,
          key: "APC",
          keyInput: "APC",
        };
        bio.push(apc);
      }
    }

    // Yeasts & Molds
    if (index.Yeasts == null) {
      let Yeasts = {
        int: false,
        coa: false,
        val: index.Yeasts,
        key: "Yeasts & Molds",
        keyInput: "Yeasts",
      };
      bio.push(Yeasts);
    } else {
      if (index.Yeasts >= index.YeastsMin && index.Yeasts <= index.YeastsMax) {
        let Yeasts = {
          int: true,
          coa: true,
          val: index.Yeasts,
          key: "Yeasts & Molds",
          keyInput: "Yeasts",
        };
        bio.push(Yeasts);
      } else {
        let Yeasts = {
          int: false,
          coa: false,
          val: index.Yeasts,
          key: "Yeasts & Molds",
          keyInput: "Yeasts",
        };
        bio.push(Yeasts);
      }
    }

    // E. coil
    if (index.EColi == null) {
      let EColi = {
        int: false,
        coa: false,
        val: index.EColi,
        key: "E. coil",
        keyInput: "EColi",
      };
      bio.push(EColi);
    } else {
      if (index.EColi >= index.EColiMin && index.EColi <= index.EColiMax) {
        let EColi = {
          int: true,
          coa: true,
          val: index.EColi,
          key: "E. coil",
          keyInput: "EColi",
        };
        bio.push(EColi);
      } else {
        let EColi = {
          int: false,
          coa: false,
          val: index.EColi,
          key: "E. coil",
          keyInput: "EColi",
        };
        bio.push(EColi);
      }
    }

    // Coliform
    if (index.Coliform == null) {
      let Coliform = {
        int: false,
        coa: false,
        val: index.Coliform,
        key: "Coliform",
        keyInput: "Coliform",
      };
      bio.push(Coliform);
    } else {
      if (
        index.Coliform >= index.ColiformMin &&
        index.Coliform <= index.ColiformMax
      ) {
        let Coliform = {
          int: true,
          coa: true,
          val: index.Coliform,
          key: "Coliform",
          keyInput: "Coliform",
        };
        bio.push(Coliform);
      } else {
        let Coliform = {
          int: false,
          coa: false,
          val: index.Coliform,
          key: "Coliform",
          keyInput: "Coliform",
        };
        bio.push(Coliform);
      }
    }

    // S. aureus
    if (index.Saureus == null) {
      let Saureus = {
        int: false,
        coa: false,
        val: index.Saureus,
        key: "S. aureus",
        keyInput: "Saureus",
      };
      bio.push(Saureus);
    } else {
      if (
        index.Saureus >= index.SaureusMin &&
        index.Saureus <= index.SaureusMax
      ) {
        let Saureus = {
          int: true,
          coa: true,
          val: index.Saureus,
          key: "S. aureus",
          keyInput: "Saureus",
        };
        bio.push(Saureus);
      } else {
        let Saureus = {
          int: false,
          coa: false,
          val: index.Saureus,
          key: "S. aureus",
          keyInput: "Saureus",
        };
        bio.push(Saureus);
      }
    }

    let DD = [];

    TimeToTest.push({ TimeTest: index.timestampTest });
    DD.push({ Description: index.Description });
    results.push(TestedIndex, bio, TimeToTest, DD);
    // console.log('index : ', index)

    return results;
  } else {
    return null;
  }
}

exports.dailyReportBio = async (req, res, next) => {
  var { body } = req;
  let ds = body.dStart;
  let de = body.dNow;
  await req.getConnection(async (err, connection) => {
    if (err) return next(err);
    var sql =
      " SELECT *, \
CASE 	\
	WHEN APC >= PdSpecificMicro.APCMin AND APC <= PdSpecificMicro.APCMax THEN '1' \
    ELSE '0'  \
END AS resultAPC , \
CASE \
    WHEN Yeasts >= PdSpecificMicro.YeastsMin AND Yeasts <= PdSpecificMicro.YeastsMax THEN '1' \
    ELSE '0' \
END AS resultYeasts , \
CASE \
    WHEN EColi >= PdSpecificMicro.EColiMin AND EColi <= PdSpecificMicro.EColiMax THEN '1' \
    ELSE '0' \
END AS resultEColi, \
CASE \
    WHEN Coliform >= PdSpecificMicro.ColiformMin AND Coliform <= PdSpecificMicro.ColiformMax THEN '1' \
    ELSE '0' \
END AS resultColiform, \
CASE \
    WHEN Saureus >= PdSpecificMicro.SaureusMin AND Saureus <= PdSpecificMicro.SaureusMax THEN '1' \
    ELSE '0' \
END AS resultSaureus \
FROM (SELECT testResults.*,Orders.ProductName, Orders.idOrders   \
FROM `" +
      process.env.DB_NAME +
      "`.testResults jaw-app JOIN `" +
      process.env.DB_NAME +
      "`.Orders ON testResults.idOrderTested = Orders.idOrders where testResults.timestampTest BETWEEN ? AND ? ) \
FULL JOIN `" +
      process.env.DB_NAME +
      "`.PdSpecificMicro; ";

    await connection.query(
      sql,
      [`${ds.toString()}`, `${de.toString()}`],
      async (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
            message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
          });
        }
      }
    );
  });
};

exports.readTestReportlasted = (req, res, next) => {
  var { body } = req;
  // console.log(body)
  var idOrders = body.idOrders;
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "SELECT * FROM `" +
      process.env.DB_NAME +
      "`.testResults, `" +
      process.env.DB_NAME +
      "`.PdSpecificChem  , `" +
      process.env.DB_NAME +
      "`.PdSpecificMicro \
         WHERE testResults.idOrderTested = ? AND testResults.idSpfChem = PdSpecificChem.idPdSpecificChem  ORDER BY testResults.timestampTest DESC LIMIT 1;";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        if (results[0] == undefined) {
          res.json({
            success: "error",
            message: "error",
          });
        } else {
          var resultTested = testResult(results[0]);

          res.json({
            success: "success",
            message: results[0],
            resulted: resultTested,
            message_th: "ทำการอ่านข้อมูล order ลงรายงการเรียบร้อย",
          });
        }
      }
    });
  });
};

exports.Recheck = (req, res, next) => {
  var { body } = req;
  var idOrders = body.idOrders;
  var Recheck = body.Recheck;
  Recheck = Recheck + 1;
  var ProductName = body.ProductName;
  var listRecheck = body.listRecheck;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET  Recheck=? , Status=2 WHERE idOrders = ?";
    connection.query(sql, [Recheck, idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        req.getConnection((err, connection) => {
          if (err) return next(err);

          var sql =
            "UPDATE `" +
            process.env.DB_NAME +
            "`.`RealTimeCardDS` SET  Recheck=Recheck+1 WHERE idRealTimeCardDS = 1";
          connection.query(sql, [Recheck, idOrders], (err, results) => {
            if (err) {
              return next(err);
            } else {
              res.json({
                success: "success",
                message: results,
                message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย",
              });
              //real request
              request(
                {
                  method: "POST",
                  uri: "https://notify-api.line.me/api/notify",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  auth: {
                    bearer: tokenLineProduction,
                  },
                  form: {
                    message: `Order ${ProductName} status recheck ==> { ${listRecheck.toString()} } `,
                  },
                },
                (err, httpResponse, body) => {
                  if (err) {
                    console.log(err);
                  } else {
                  }
                }
              );
            }
          });
        });
      }
    });
  });
};

exports.WaitMicro = (req, res, next) => {
  var { body } = req;
  var idOrders = body.idOrders;

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET Status=3 WHERE idOrders = ?";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
          message_th: "ทำการแก้ไขข้อมูล order ลงรายงการเรียบร้อย",
        });
      }
    });
  });
};

exports.readFG = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;

  var current_datetime = new Date();
  let formatted_date_now =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate();

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT * FROM `" +
      process.env.DB_NAME +
      "`.`RealTimeDonutFG` WHERE date=? ";
    connection.query(sql, [formatted_date_now], (err, results) => {
      if (err) {
        return next(err);
      } else {
        if (results.length > 0) {
          res.json({
            success: "success",
            message: results,
          });
        } else {
          req.getConnection((err, connection) => {
            if (err) return next(err);
            var sql =
              "INSERT INTO `" +
              process.env.DB_NAME +
              "`.`RealTimeDonutFG` (`TN` , `PH` , `SALT`, `TSS`, `HISTAMINE`, `SPG`, `AW`, `AN`, `Acidity`, `Viscosity`, `date`) VALUES (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?);";
            connection.query(sql, [formatted_date_now], (err, results) => {
              if (err) {
                return next(err);
              } else {
                res.json({
                  success: "success",
                  message: results,
                });
              }
            });
          });
        }
      }
    });
  });
};

exports.readST = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;

  var current_datetime = new Date();
  let formatted_date_now =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate();

  req.getConnection((err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT * FROM `" +
      process.env.DB_NAME +
      "`.`RealTimeDonutST` WHERE date=? ";
    connection.query(sql, [formatted_date_now], (err, results) => {
      if (err) {
        return next(err);
      } else {
        if (results.length > 0) {
          res.json({
            success: "success",
            message: results,
          });
        } else {
          req.getConnection((err, connection) => {
            if (err) return next(err);
            var sql =
              "INSERT INTO `" +
              process.env.DB_NAME +
              "`.`RealTimeDonutFG` (`water` , `swap` , `air`, `date`) VALUES (0, 0, 0, 0, ?);";
            connection.query(sql, [formatted_date_now], (err, results) => {
              if (err) {
                return next(err);
              } else {
                res.json({
                  success: "success",
                  message: results,
                });
              }
            });
          });
        }
      }
    });
  });
};

exports.updateFG = (req, res, next) => {
  var { body } = req;

  var Tn = body.Tn;
  var PH = body.PH;
  var Salt = body.Salt;
  var Tss = body.Tss;
  var Histamine = body.Histamine;
  var SPG = body.SPG;
  var Aw = body.Aw;
  var AN = body.AN;
  var Acidity = body.Acidity;
  var Viscosity = body.Viscosity;

  var current_datetime = new Date();
  let formatted_date_now =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate();

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`RealTimeDonutFG` SET `TN` = `TN`+? , `PH` = `PH`+? , `SALT`=`SALT`+?, `TSS`=`TSS`+?, `HISTAMINE`=`HISTAMINE`+?, `SPG`=`SPG`+?, `AW`=`AW`+?  ,`AN`=`AN`+? , `Acidity`=`Acidity`+? , `Viscosity`=`Viscosity`+? WHERE date=? ";
    connection.query(
      sql,
      [
        Tn,
        PH,
        Salt,
        Tss,
        Histamine,
        SPG,
        Aw,
        AN,
        Acidity,
        Viscosity,
        formatted_date_now,
      ],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
          });
        }
      }
    );
  });
};

exports.updateSTadST = (req, res, next) => {
  var { body } = req;

  var Tn = body.Tn;
  var PH = body.PH;
  var Salt = body.Salt;
  var Tss = body.Tss;
  var Histamine = body.Histamine;
  var SPG = body.SPG;
  var Aw = body.Aw;

  // console.log('updateFG : ' ,body)

  var current_datetime = new Date();
  let formatted_date_now =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate();

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`RealTimeDonutST` SET `water` = `water`+? , `swap` = `swap`+? , `air`=`air`+?, WHERE date=?";
    connection.query(
      sql,
      [Tn, PH, Salt, Tss, Histamine, SPG, Aw, formatted_date_now],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
          });
        }
      }
    );
  });
};

exports.updateCardDS = (req, res, next) => {
  var { body } = req;

  var allOrder;
  var COA;
  var Recheck;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql = "SELECT * FROM `" + process.env.DB_NAME + "`.Orders;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        allOrder = results.length;

        req.getConnection((err, connection) => {
          if (err) return next(err);
          var sql =
            "UPDATE `" +
            process.env.DB_NAME +
            "`.RealTimeCardDS SET ALLSample=?  WHERE idRealTimeCardDS = 1 ;";
          connection.query(sql, [allOrder], (err, results) => {
            if (err) {
              return next(err);
            } else {
              res.json({
                success: "success",
                message: results,
              });
            }
          });
        });
      }
    });
  });
};

exports.readCardDS = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql = "SELECT * FROM `" + process.env.DB_NAME + "`.RealTimeCardDS;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.exportCOA = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) {
      return next(err);
    } else {
      let url =
        process.env.DB_NAME === "jaw-app"
          ? "https://jaw.sgp1.digitaloceanspaces.com/Logo-RFS.png"
          : "https://jaw.sgp1.digitaloceanspaces.com/veitlogo.jpg";
      imageToBase64(url)
        .then((response) => {
          res.json({
            success: "success",
            message: response,
          });
          // console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
        })
        .catch((error) => {
          // console.log(error); // Logs an error if there was one
        });
    }
  });
};

exports.loadHalalLogo = (req, res, next) => {
  // console.log('exportCOA')
  req.getConnection((err, connection) => {
    if (err) {
      return next(err);
    } else {
      imageToBase64("https://jaw.sgp1.digitaloceanspaces.com/Halalpngeng.png") // Path to the image
        .then((response) => {
          res.json({
            success: "success",
            message: response,
          });
          // console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
        })
        .catch((error) => {
          // console.log(error); // Logs an error if there was one
        });
    }
  });
};
// https://jaw.sgp1.digitaloceanspaces.com/Halalpngeng.png

exports.UpdatexportCOA = (req, res, next) => {
  var { body } = req;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.RealTimeCardDS SET COAExprot=COAExprot+1  WHERE idRealTimeCardDS = 1 ;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.UpdatexportPASS = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql2 =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET Status=1 WHERE idOrders = ?";
    connection.query(sql2, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.PassToCheck = (req, res, next) => {
  var { body } = req;
  var idOrders = body.idOrders.idOrders;
  var pn = body.ProductName;
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql2 =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET Status=4 WHERE idOrders = ?";
    connection.query(sql2, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
        //real request
        request(
          {
            method: "POST",
            uri: "https://notify-api.line.me/api/notify",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
              bearer: tokenLineProduction,
            },
            form: {
              message: `${pn} status complete check  `,
            },
          },
          (err, httpResponse, body) => {
            if (err) {
              console.log(err);
            } else {
            }
          }
        );
      }
    });
  });
};
// 4NDaXviNWZub9nXzKHPwnKSt07xAmG4aqOLwNzlHhjd
// request({
//     method: 'POST',
//     uri: 'https://notify-api.line.me/api/notify',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     auth: {
//       'bearer': tokenLineProduction
//     },
//     form: {
//       message: `มีการส่งตัวอย่างชื่อ ${productname} สูตร ${JSON.stringify(results3[0].name)} ต้องทำการตรวจวัด ${messageSampleObject.toString().trim()}`
//     }
//   }, (err, httpResponse, body) => {
//     if(err){
//       console.log(err);
//     } else {
//     }
//   });

exports.CustomersName = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql = "SELECT * FROM `" + process.env.DB_NAME + "`.Customers;";
    connection.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.UpdateStatusReprocess = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;
  var description = body.Description;
  var ProductName = body.ProductName;
  let DesArray = [];

  if (description.TN) {
    DesArray.push("TN");
  }
  if (description.Salt) {
    DesArray.push("Salt");
  }
  if (description.Histamine) {
    DesArray.push("Histamine");
  }
  if (description.PH) {
    DesArray.push("PH");
  }
  if (description.Aw) {
    DesArray.push("Aw");
  }
  if (description.Tss) {
    DesArray.push("Tss");
  }
  if (description.SPG) {
    DesArray.push("SPG");
  }
  if (description.AN) {
    DesArray.push("AN");
  }
  if (description.Acidity) {
    DesArray.push("Acidity");
  }
  if (description.Viscosity) {
    DesArray.push("Viscosity");
  }
  if (description.SaltMeter) {
    DesArray.push("SaltMeter");
  }
  if (description.Color) {
    DesArray.push("Color");
  }
  if(description.Gluten){
    DesArray.push("Gluten");
  }

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET Status=5 WHERE idOrders = ?";
    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        var sql2 =
          "UPDATE `" +
          process.env.DB_NAME +
          "`.`testResults` SET  Description = ? WHERE idOrderTested = ?";
        connection.query(
          sql2,
          [`${DesArray.toString()}`, idOrders],
          (err, results) => {
            if (err) {
              return next(err);
            } else {
              request(
                {
                  method: "POST",
                  uri: "https://notify-api.line.me/api/notify",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  auth: {
                    bearer: tokenLineLab,
                  },
                  form: {
                    message: `Reprocess from production order ${ProductName} list :  ${DesArray.toString()} `,
                  },
                },
                (err, httpResponse, body) => {
                  if (err) {
                    console.log(err);
                  } else {
                  }
                }
              );
              res.json({
                success: "success",
                message: results,
              });
            }
          }
        );
      }
    });
  });
};

// var dataResponse = [];

exports.queryDetailMulti = async (req, res, next) => {
  var { body } = req;
  var idOrders = body.id;

  req.getConnection(async (err, connection) => {
    if (err) return next(err);

    var sql =
      "SELECT testResults.Tn, testResults.PH, testResults.Salt, testResults.Tss, testResults.Histamine, testResults.SPGTest, testResults.Aw, testResults.AN, testResults.tempAW,\
testResults.Acidity, testResults.Gluten,  testResults.Viscosity, testResults.SaltMeter, testResults.Color,testResults.APC, testResults.EColi, Orders.ProductName FROM `" +
      process.env.DB_NAME +
      "`.testResults, `" +
      process.env.DB_NAME +
      "`.Orders,`" +
      process.env.DB_NAME +
      "`.PdSpecificChem  , `" +
      process.env.DB_NAME +
      "`.PdSpecificMicro \
WHERE testResults.idOrderTested = ? AND testResults.idSpfChem = PdSpecificChem.idPdSpecificChem AND testResults.idOrderTested = Orders.idOrders ORDER BY testResults.timestampTest DESC LIMIT 1;";

    connection.query(sql, [idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.qaVerifyTestResult = (req, res, next) => {
  const { body } = req;

  const idOrders = body.idOrders;
  const verify = body.verify;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET verify=? WHERE idOrders = ?";
    connection.query(sql, [verify, idOrders], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.updateTestDateOrder = (req, res, next) => {
  const { body } = req;
  const testDate = body.testDate;
  const collected = body.collected;
  const idOrders = body.idOrders;
  const sampleCharactor = body.sampleCharactor;

  req.getConnection((err, connection) => {
    const sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` set testDate=?, collected=?, sampleCharactor=? WHERE idOrders = ? ;";

    connection.query(
      sql,
      [testDate, collected, sampleCharactor, idOrders],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
          });
        }
      }
    );
  });
};

exports.UpdateDatailOrder = (req, res, next) => {
  var { body } = req;

  var idOrders = body.idOrders;
  var RefNo = body.RefNo;
  var DCL1 = body.DCL1;
  var DCL2 = body.DCL2;
  var DCL3 = body.DCL3;
  var PD = body.PD;
  var DD = body.DD;
  var ED = body.ED;
  var Size = body.Size;
  var Tank = body.Tank;
  var Quantity = body.Quantity;
  var testDate = body.testDate;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    var sql =
      "UPDATE `" +
      process.env.DB_NAME +
      "`.`Orders` SET RefNo=?, PD=? , DD=? , ED=?,Tank=?, DCL1=? ,DCL2=? ,DCL3=? ,testDate=?,Size=?,Quantity=? WHERE idOrders = ?";
    connection.query(
      sql,
      [
        RefNo,
        PD,
        DD,
        ED,
        Tank,
        DCL1,
        DCL2,
        DCL3,
        testDate,
        Size,
        Quantity,
        idOrders,
      ],
      (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: "success",
            message: results,
          });
        }
      }
    );
  });
};
