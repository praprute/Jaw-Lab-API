const express      = require('express')
const app          = express()
const cors         = require('cors')
const bodyParser   = require('body-parser')
const mysql        = require('mysql')
const myConnection = require('express-myconnection')
const dbOption = require('./config')
const authRoutes = require('./routes/AuthRoute');
const productRoute = require('./routes/ProductRoute')
const PORT = 8085;
//8000
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.use(bodyParser.json());
app.use(express.json())
// console.log(dbOption)

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '12345678',
	port: 3306,
	database: 'jaw-app',
	dateStrings: true,
	insecureAuth: true,
});

connection.connect((err) => {
    if(err){
     return console.log(err)
    }
})

app.use(myConnection(mysql, dbOption.dbOption, "pool"));
app.use('/api', authRoutes);
app.use('/api', productRoute);

app.listen(PORT, () => {
    console.log("ready server on http://localhost:" + PORT);
});
   