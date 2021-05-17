const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs=require("ejs")
const cors = require('cors')
 
app.use(cors())
//List of Routes for the API
const UserRouter = require('./routes/user.routes')
const VendorRouter = require('./routes/vendor.routes')
const userRequestRouter = require('./routes/userrequest.routes')
const ServiceproviderRouter = require('./routes/serviceprovider.routes')
const SupplierRouter = require('./routes/supplier.routes')
const PaymentRouter = require('./routes/payment.routes')

//PRODUCTION DATABASE CREDENTIALS
const connectionString = 'mongodb+srv://projectconnection:shubham123@cluster0.tbsio.mongodb.net/BS_DB?retryWrites=true&w=majority';
mongoose.Promise = global.Promise;
mongoose
    .connect(
        connectionString, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,

        }
    )
    .then(
        () => {
            console.log("Mongodb is connected");
        },
        err => {
            console.log("Cannot connect to the mongodb" + err);
        }
    );


app.use(bodyParser.json({
    limit: '100mb'
}));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '100mb',
}));
app.use('/uploads',express.static('uploads'));
app.get("/payments", (req, res) => {
    res.render("payment", { key: process.env.key_id });
  });
app.use('/user', UserRouter);
app.use('/vendor', VendorRouter);
app.use('/', userRequestRouter);
app.use('/provider', ServiceproviderRouter);
app.use('/supplier', SupplierRouter);
app.use('/', PaymentRouter);



// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send(err.message);
});


/* FOR DEVELOPMENT USE PORT 3000 || FOR PRODUCTION USE PORT 80 */
app.listen(3001, () => {
    console.log('Express app listening on port 3001');
});
