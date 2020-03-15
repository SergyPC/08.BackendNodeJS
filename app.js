var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

/**
 * app es la instancia de Express
 */
var app = express(); //Definimos la aplicación de Express

/**
 * Configuramos la aplicación
 */
// view engine setup (utilizando ejs)
app.set('views', path.join(__dirname, 'views')); //Aquí le decimos a Express que cuando tenga que renderizar una vista, las vistas están en la carpeta ./views/
app.set('view engine', 'ejs'); // Y que esas vistas están estructuradas con el motor de vistas ejs (También llamado motor de plantillas)


// middlewares:
app.use(logger('dev')); //Log
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //urlencoded para temas de POST y PUT
app.use(cookieParser()); //Parsea las cookies
app.use(express.static(path.join(__dirname, 'public'))); //Servir ficheros estáticos

//Servir ficheros estáticos:
//app.use('/pdf', express.static('d:/pdfs');


// app.use( (req, res, next) => {
//   // Una de dos:
//   // - Responder:
//   // res.send('Qué tal!');
//   // - O pasar el siguiente middleware:
//   console.log('Llegó una petición de tipo', req.method);
//   next();
//   // - O llamar a next y pasarle un error (Yendo al middleware de error):
//   // next(new Error('Esto va mal, amigo'));
// });


/**
 * Establecemos las Rutas del Website (de la aplicación)
 */
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


/**
 * middlewares para la Gestión de errores (404 y resto)
 */

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
  res.render('error'); //renderizamos una página de error, mostrando el error: Llama a la vista ./views/error.ejs o html
});

module.exports = app;
