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
const PORT = 8001;
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
  host: "134.209.107.161",
  user: "admin1",
  password: "0934536550@Junior",
  port: 3306,
  database: "jaw-app", // 'veit-hong'
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
