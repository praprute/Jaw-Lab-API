const express      = require('express')
const app          = express()
const cors         = require('cors')
const bodyParser   = require('body-parser')
const mysql        = require('mysql')
const myConnection = require('express-myconnection')
const dbOption = require('./config')
const authRoutes = require('./routes/AuthRoute');
const productRoute = require('./routes/ProductRoute')
const PORT = 3031;

app.use(cors())
app.use(bodyParser.json());
app.use(express.json())
// console.log(dbOption)

var connection = mysql.createConnection({
    host: '127.0.0.1',
        user: 'admin',
        password: '0990576878JUNIOR',
        port: 3306,
        database: 'jaw-app',
        dateStrings: true,
        insecureAuth : true
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
   