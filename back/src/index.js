const app = require("express")();
var http = require("http").Server(app);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header( 'Access-Control-Allow-Credentials', 'true');
    next();
  });

// // include router
const userRoute = require('./routes/userRoute');

// // routing
app.use('/user/', userRoute);
  
const PORT = 8000;

// starting server
http.listen(PORT,() => {
    console.log(`Node server running on port: ${PORT}`);
});