var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
var passport = require('passport');
var index = require("./routes/index");
var tasks = require("./routes/tasks");
//var user = require("./routes/user");
var flash = require('connect-flash');
const config = require('./db');

const cors = require("cors");


//var configDB = require('./config/database.js');
//mongoose.connect(configDB.url);
require('./config/passport')(passport);

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

var port = 5000;

var app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, "client")));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", index);
app.use("/api", tasks);
//app.use('/api', user);
require('./app/routes.js')(app, passport);


app.get('/', function(req, res) {
    res.send('hello');
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});
