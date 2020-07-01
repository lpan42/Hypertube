const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const User = require('./models/user');
const Downloaded = require('./models/downloaded');
const userRoute = require('./routes/userRoute');
const oAuthRoute = require('./routes/oAuthRoute');
const movieRoute = require('./routes/movieRoute');
const commentRoute = require('./routes/commentRoute');
const cron = require('node-cron');
const moment = require('moment');
const fs = require('fs');
const rootPath = process.cwd();

mongoose.connect("mongodb://localhost:27017/hypertube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false,
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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header( 'Access-Control-Allow-Credentials', 'true');
    next();
  });
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
passport.serializeUser((user, done) => {
  done(null, user); 
});
passport.deserializeUser((user, done) => {
  done(null, user); 
});


// routing
app.use('/user/', userRoute);
app.use('/auth/', oAuthRoute);
app.use('/movie/', movieRoute);
app.use('/comment/', commentRoute);

const PORT = 8000;

// starting server
http.listen(PORT,() => {
    console.log(`Node server running on port: ${PORT}`);
});

//Delete movies that nobody seen for a month
//Check at midnite 00:00  everyday
cron.schedule('00 00 * * *', () => {
  console.log('Checking LastView Time and Remove movies');
  const oneMonthBefore = moment().subtract(1, 'month');
  Downloaded.find({LastView: {$lte: oneMonthBefore}}, (err, res) => {
    if(err) console.log(err);
    if(res.length){
      res.map(async m => {
        // console.log(m);
        if(m.FilePath){
          if (fs.existsSync(rootPath + m.FilePath)){
            fs.unlink(rootPath + m.FilePath, (err) => {
              if (err) console.log(err);
              console.log(m.FilePath + ' was deleted');
            });
          }
          Downloaded.deleteOne({ ImdbId: m.ImdbId, Quality:m.Quality, Provider:m.Provider },(err) => {
            if(err) console.log(err);
          })
        }
      })
    }
  })
});