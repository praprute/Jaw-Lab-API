require("dotenv").config();

exports.getHeaderCoa1 = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    const sql =
      "SELECT idfirst_coa,ref_no,ref_date,Name as customer_name, date_code_list_1,\
    date_code_list_2,date_code_list_3,production_date,dalivery_date, \
    exp_date,pack_size,tank_no,quantity,test_date,timestamp \
    FROM `" +
      process.env.DB_NAME +
      "`.first_coa left join(SELECT * FROM `" +
      `${process.env.DB_NAME}` +
      "`.Customers) customer ON customer.idCustomers = first_coa.customer;";

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.getHeaderCoa2 = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    const sql =
      "SELECT idsecond_coa, ref_no, ref_date, Name as customer_name, lot, collected_date,\
      production_date, collected_date_2, exp_date, tank_no, \
    timestamp \
    FROM `" +
      process.env.DB_NAME +
      "`.second_coa left join (SELECT * FROM `" +
      `${process.env.DB_NAME}` +
      "`.Customers) customer ON customer.idCustomers = second_coa.customer;";

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.getHeaderCoa3 = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    const sql =
      "SELECT idthird_coa, description, Name as customer_name, invoice, eta,\
      shelf_life, \
    timestamp \
    FROM `" +
      process.env.DB_NAME +
      "`.third_coa left join (SELECT * FROM `" +
      `${process.env.DB_NAME}` +
      "`.Customers) customer ON customer.idCustomers = third_coa.customer;";

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.getHeaderCoa4 = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    const sql =
      "SELECT idfourth_coa, lot_1,lot_2, Name as customer_name, date_of_report, pack_size,\
      quantity,shelf_life,completion_date, \
    timestamp \
    FROM `" +
      process.env.DB_NAME +
      "`.fourth_coa left join (SELECT * FROM `" +
      `${process.env.DB_NAME}` +
      "`.Customers) customer ON customer.idCustomers = fourth_coa.customer;";

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.getHeaderCoa5 = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    const sql =
      "SELECT idfifth_coa,ref_no,ref_date,Name as customer_name, lot,\
      collected_date,tank_no,production_date,field_null,exp_date,completion_date,test_date, \
      timestamp \
    FROM `" +
      process.env.DB_NAME +
      "`.fifth_coa left join (SELECT * FROM `" +
      `${process.env.DB_NAME}` +
      "`.Customers) customer ON customer.idCustomers = fifth_coa.customer;";

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.saveHeaderCoa1 = (req, res, next) => {
  const { body } = req;
  const {
    ref_no,
    ref_date,
    customer,
    date_code_list_1,
    date_code_list_2,
    date_code_list_3,
    production_date,
    dalivery_date,
    exp_date,
    pack_size,
    tank_no,
    quantity,
    test_date,
  } = body;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    let sql = "";

    if (Boolean(customer)) {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.first_coa " +
        `(ref_no, ref_date,customer,
      date_code_list_1,
      date_code_list_2,
      date_code_list_3,
      production_date,
      dalivery_date,
      exp_date,
      pack_size,
      tank_no,
      quantity,
      test_date) VALUES ('${ref_no}', '${ref_date}',${customer},'${date_code_list_1}','${date_code_list_2}',
      '${date_code_list_3}','${production_date}','${dalivery_date}','${exp_date}','${pack_size}','${tank_no}',
      '${quantity}','${test_date}');`;
    } else {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.first_coa " +
        `(ref_no, ref_date,
      date_code_list_1,
      date_code_list_2,
      date_code_list_3,
      production_date,
      dalivery_date,
      exp_date,
      pack_size,
      tank_no,
      quantity,
      test_date) VALUES ('${ref_no}', '${ref_date}','${date_code_list_1}','${date_code_list_2}',
      '${date_code_list_3}','${production_date}','${dalivery_date}','${exp_date}','${pack_size}','${tank_no}',
      '${quantity}','${test_date}');`;
    }

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.saveHeaderCoa2 = (req, res, next) => {
  const { body } = req;
  const {
    ref_no,
    ref_date,
    customer,
    lot,
    collected_date,
    collected_date_2,
    production_date,
    exp_date,
    tank_no,
  } = body;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    let sql = "";

    if (Boolean(customer)) {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.second_coa " +
        `(ref_no, ref_date, customer,
          lot,
          collected_date,
          collected_date_2,
          production_date,
          exp_date,
          tank_no) VALUES ('${ref_no}', '${ref_date}',${customer},'${lot}','${collected_date}',
      '${collected_date_2}','${production_date}','${exp_date}','${tank_no}');`;
    } else {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.second_coa " +
        `(ref_no, ref_date,
          lot,
          collected_date,
          collected_date_2,
          production_date,
          exp_date,
          tank_no) VALUES ('${ref_no}', '${ref_date}','${lot}','${collected_date}',
          '${collected_date_2}','${production_date}','${exp_date}','${tank_no}');`;
    }

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.saveHeaderCoa3 = (req, res, next) => {
  const { body } = req;
  const { description, customer, invoice, eta, shelf_life } = body;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    let sql = "";

    if (Boolean(customer)) {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.third_coa " +
        `(description, customer,
          invoice,
          eta,
          shelf_life
        ) VALUES ('${description}',${customer},'${invoice}','${eta}',
      '${shelf_life}');`;
    } else {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.third_coa " +
        `(description,
          invoice,
          eta,
          shelf_life) VALUES ('${description}','${invoice}','${eta}',
          '${shelf_life}');`;
    }

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.saveHeaderCoa4 = (req, res, next) => {
  const { body } = req;
  const {
    customer,
    lot_1,
    lot_2,
    date_of_report,
    pack_size,
    quantity,
    shelf_life,
    completion_date,
  } = body;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    let sql = "";

    if (Boolean(customer)) {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.fourth_coa " +
        `(customer,
          lot_1,
          lot_2,
          date_of_report,
          pack_size,
          quantity,
          shelf_life,
          completion_date) VALUES (${customer},'${lot_1}','${lot_2}',
      '${date_of_report}','${pack_size}','${quantity}','${shelf_life}','${completion_date}');`;
    } else {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.fourth_coa " +
        `(lot_1,
          lot_2,
          date_of_report,
          pack_size,
          quantity,
          shelf_life,
          completion_date,) VALUES ('${lot_1}','${lot_2}',
          '${date_of_report}','${pack_size}','${quantity}','${shelf_life}','${completion_date}');`;
    }

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};

exports.saveHeaderCoa5 = (req, res, next) => {
  const { body } = req;
  const {
    ref_no,
    ref_date,
    customer,
    lot,
    collected_date,
    field_null,
    production_date,
    tank_no,
    exp_date,
    completion_date,
    test_date,
  } = body;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    let sql = "";

    if (Boolean(customer)) {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.fifth_coa " +
        `( ref_no,
          ref_date,
          customer,
          lot,
          collected_date,
          field_null,
          production_date,
          tank_no,
          exp_date,
          completion_date,
          test_date) VALUES ('${ref_no}', '${ref_date}',${customer},\
          '${lot}','${collected_date}',
          '${field_null}','${production_date}','${tank_no}',\
          '${exp_date}','${completion_date}','${test_date}');`;
    } else {
      sql =
        "INSERT INTO `" +
        process.env.DB_NAME +
        "`.fifth_coa " +
        `( ref_no,
          ref_date,
          lot,
          collected_date,
          field_null,
          production_date,
          tank_no,
          exp_date,
          completion_date,
          test_date)  VALUES ('${ref_no}', '${ref_date}',${customer},\
          '${lot}','${collected_date}',
          '${field_null}','${production_date}','${tank_no}',\
          '${exp_date}','${completion_date}','${test_date}');`;
    }

    connection.query(sql, [], (err, results) => {
      if (err) {
        res.json({
          success: "error",
          message: err,
        });
      } else {
        res.json({
          success: "success",
          message: results,
        });
      }
    });
  });
};
