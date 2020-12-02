var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// please change the port in /bin/www
// const port = 4007;

// bc of CORS error, use this:
const cors = require("cors");

var allowedOrigins = ['http://localhost:3000',
                      'http://yourapp.com'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Import file
let jsonData = require('./pokedex.json')
// const fs = require("fs");
// const hnDataFileRaw = fs.readFileSync('./pokedex.json');
// let hnDataFileJson = JSON.parse(hnDataFileRaw);
// get all pokemons
app.get("/pokemon", (req, res) => {
    res.json(jsonData);
});

// get pokemon by id
app.get("/pokemon/:id", (req, res) => {
  const pokemonId = req.params.id;
  console.log(req.params.id);
  const pokemon = jsonData.find(_item => _item.id === parseInt(pokemonId));
  if (pokemon) {
     res.json(pokemon);
  } else {
     res.json({ message: `Pokemon ${pokemonId} doesn't exist`})
  }
});

// get pokemon name by id
app.get("/pokemon/:id/:info", (req, res) => {
  const pokemonId = req.params.id;
  const pokemon = jsonData.find(_item => _item.id === parseInt(pokemonId));
  if (pokemon) {
     res.json(pokemon.name.english);
  } else {
     res.json({ message: `Pokemon ${pokemonId} doesn't exist`})
  }
});

// get pokemon by position in array 
// app.get('/test/:id', (req, res) => {
//   return res.json(jsonData[req.params.id]);
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// myCode
app.get("/hello", (req, res) => {
  res.send("Hello to you too!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
