'use strict'

var express = require('express');
var router = express.Router();

const getAds = require('./../public/javascripts/apiCalls');

//Validaciones En el middleware: Destructuring:
const { query, check, validationResult } = require('express-validator');

/* Middleware */
// router.get y router.use es lo mismo
// Ponerle .get es un filtro más: Es decirle a Express sólo cuando la petición sea de tipo GET y sea a la raiz de este middleware, entonces le pasas el request a este middleware que hay aquí
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' }); //renderiza la vista/pagina index y le vas a pasar el siguiente objeto ({...}) a la vista ./views/index.ejs o html
// });

router.get('/', async function (req, res, next) {
  try {
    // let queryparams = '';
    // for (let i = 1; i < req.url.length; i++){
    //   queryparams += req.url[i];
    //   console.log("queryparams:", queryparams);
    // }

    /**
     * http://localhost:3000/?name=ip&sell=1
     * req.url: /?name=ip&sell=1
     */
    const queryparams = req.url; // req.url: /?name=ip&sell=1

    console.log("req.url:", req.url);
    console.log("req.url.length:", req.url.length);
    console.log("queryparams:", queryparams);


    const sell = req.query.sell;
    const price = req.query.price;
    let isIncorrect = false;


    if (typeof sell !== 'undefined') { 
      if (sell !== 'true' && sell !== 'false' && sell !== '1' && sell !== '0') { //Si han añadido un valor que no es boolean
          isIncorrect = true;
      }
    }

    
    console.log("COMENZAMOS PRICE!!");
    if (typeof price !== 'undefined') { 
      const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
      const rango = price.split('-');
      // console.log("1");
      // console.log ("rango.length:", rango.length);
      // console.log ("rango:", rango);
      // // Solo usar con 2 valores: // console.log ("rango[0] hay ',':", rango[0].indexOf(',') !== -1);
      // // Solo usar con 2 valores: // console.log ("rango[1] hay ',':", rango[1].indexOf(',') !== -1);
      console.log ("price.startsWith('-', 0):", price.startsWith('-', 0));
      if (rango.length === 1) { //price=50
        if (!(regExpNumbers.test(price)) || price.indexOf(',') !== -1) 
          isIncorrect = true;
      }
      else if (rango.length === 2) { //Si contiene algún guión
        if(price.startsWith('-', 0)) { //price=-50
          if (!(regExpNumbers.test(rango[1])) || rango[1].indexOf(',') !== -1) 
            isIncorrect = true;  
        }
        else {
          if (!rango[1]) { //price=10-
            if (!(regExpNumbers.test(rango[0])) || rango[0].indexOf(',') !== -1) 
              isIncorrect = true;
          }
          else { //price=10-50
            if (!(regExpNumbers.test(rango[0])) || rango[0].indexOf(',') !== -1 || !(regExpNumbers.test(rango[1])) || rango[1].indexOf(',') !== -1) 
              isIncorrect = true;
          }
        } 
      } 
      else { //Si contiene 3 o más valores
        isIncorrect = true;
      }
    }

    let ads;
    if (isIncorrect) { //Si han añadido algún valor erróneo
      ads = []; 
    }
    else {
      ads = await getAds(queryparams);
    }

    //const ads = await getAds(queryparams);
    
    res.render('index', {
      title: 'NodePOP',
      data: ads,
    });
  }
  catch (err) {
    // //console.log("err (./routes/index.js):", err);
    console.log("Error en ./routes/index.js:");
    // //console.log("Error:", error);
    // console.log("Error (err.response.data):", err.response.data);
    next(err);

    //validationResult(req).throw();
  }
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
