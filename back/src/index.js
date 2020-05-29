const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const User = require('./models/user');
const userRoute = require('./routes/userRoute');
const oAuthRoute = require('./routes/oAuthRoute');

mongoose.connect("mongodb://localhost:27017/hypertube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Hypertube database connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header( 'Access-Control-Allow-Credentials', 'true');
//     next();
//   });
app.use(
  session({
    secret: 'HyperTube',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// routing
app.use('/user/', userRoute);
app.use('/auth/', oAuthRoute);


const PORT = 8000;

// starting server
http.listen(PORT,() => {
    console.log(`Node server running on port: ${PORT}`);
});