var express = require('express');
var router = express.Router();

//Validaciones En el middleware: Destructuring:
const { query, check, validationResult } = require('express-validator');

/* Middleware */
// router.get y router.use es lo mismo
// Ponerle .get es un filtro más: Es decirle a Express sólo cuando la petición sea de tipo GET y sea a la raiz de este middleware, entonces le pasas el request a este middleware que hay aquí
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); //renderiza la vista/pagina index y le vas a pasar el siguiente objeto ({...}) a la vista ./views/index.ejs o html
});

// Querystring con validaciones
// npm i express-validator@4.0.0
router.get('/enquerystring', [
  query('talla').isNumeric().withMessage('debería ser numérico'),
  //check('talla').isNumeric().withMessage('debería ser numérico'), //No sólo mira en el queryparams sino en todos los sitios donde pueda recibir ese parámetro
  query('color').isString().withMessage('debería ser string'),
  // query('color').custom (value => {
  //   // añadir la logica para ese value
  //   return true; // Es que valida
  //   return false; // Es que no valida
  // }),
], (req, res, next) => { //http://localhost:3000/enquerystring?talla=L&color=rojo
  // try {
    validationResult(req).throw(); // lanza excepción si hay errores de validación
    console.log("req.query:", req.query);
    res.send('OK');
  // } catch (err) {
  //   next(err);
  // }
});

module.exports = router;
