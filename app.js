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
//app.set('views', path.join(__dirname, 'views')); //Aquí le decimos a Express que cuando tenga que renderizar una vista, las vistas están en la carpeta ./views/
//app.set('view engine', 'ejs'); // Y que esas vistas están estructuradas con el motor de vistas ejs (También llamado motor de plantillas)

// view engine setup utilizando html
app.set('views', path.join(__dirname, 'views')); //Aquí le decimos a Express que cuando tenga que renderizar una vista, las vistas están en la carpeta ./views/
app.set('view engine', 'html'); // Y que esas vistas están estructuradas con el motor de vistas html (También llamado motor de plantillas)
app.engine('html', require('ejs').__express); //Definimos un nuevo motor de vistas html

// middlewares:
app.use(logger('dev')); //Log
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //urlencoded para temas de POST y PUT
app.use(cookieParser()); //Parsea las cookies
app.use(express.static(path.join(__dirname, 'public'))); //Servir ficheros estáticos

// Servir ficheros estáticos:
// app.use('/pdf', express.static('d:/pdfs'));


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
  if(err.array) { // error de validación (Añadido para las validaciones de express-validator)
    err.status = 422; // ponemos el error Unprocessable Entity para que no devuleva el error 500 ya que la validación realizada en index (router.get('/enquerystring') no está devolviendo ningún error y la linea "res.status(err.status || 500);" si no hay error pone un 500
    
    /**
     * onlyFirstError: true -> Solo cogemos el primer error para cada campo añadido en la validación del index (talla, color, piso, dirección, ...), añadiéndolo al array. (podríamos cogerlos todos).
     * Ya que un campo puede tener varios errores de validación y sólo queremos pasar el primero que se genere 
     * Por ejemplo, El campo Letra sólo puede ser letra y en mayusculas:
     *  query('letra').isString().withMessage('debería ser numérico'),
     *  query('letra').isUppercase().withMessage('debería ser numérico'),
     * Si hubiera más validaciones de otros campos se iría añadiendo al array (err.array) el primer error encontrado (onlyFirstError).
     */
    const errInfo = err.array({ onlyFirstError: true })[0]; // err.array devuelve un array. Al poner [0] sólo cogemos el primer error que haya en ese array de errores.
    
    //err.message = `El parámetro ${errInfo.param} ${errInfo.msg}`;
    err.message = isAPIRequest(req) ? 
    { message: 'Not valid', errors: err.mapped() }
    : `El parámetro ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  if (isAPIRequest(req)) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.render('error'); //renderizamos una página de error, mostrando el error: Llama a la vista ./views/error.ejs o html
});

function isAPIRequest(req) {
  return req.originalUrl.startsWith('/api/'); //Devuelve todo menos el dominio (http://localhost:3000/api/zzz devuelve /api/zzz)
}

module.exports = app;
