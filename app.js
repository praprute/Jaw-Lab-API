const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const dbOption = require("./config");
const authRoutes = require("./routes/AuthRoute");
const productRoute = require("./routes/ProductRoute");
const documentRoute = require("./routes/DocumentRoute");
const PORT = 8000;
//8000
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(bodyParser.json());
app.use(express.json());
// console.log(dbOption)

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "admin1",
  password: "0934536550@junior",
  port: 3306,
  database: "veit-hong", // 'veit-hong'
  dateStrings: true,
  insecureAuth: true,
});

connection.connect((err) => {
  if (err) {
    return console.log(err);
  }
});

app.use(myConnection(mysql, dbOption.dbOption, "pool"));
app.use("/api", authRoutes);
app.use("/api", productRoute);
app.use("/api", documentRoute);

app.listen(PORT, () => {
  console.log("ready server on http://localhost:" + PORT);
});
