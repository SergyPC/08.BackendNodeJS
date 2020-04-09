'use strict'

var express = require('express');
var router = express.Router();

// Cargamos y utilizamos el modelo de Tag para utilizar los diferentes métodos del API (GET, POST, PUT, DELETE...)
const Tag = require('../models/Tag');

router.get('/', async (req, res, next) => {
  try {
      const name = req.query.name;
      // Si no hay req.query.limit (No lo han añadido) devuelve como máximo 100 documentos
      const limit = parseInt(req.query.limit || 100); //Lo convertimos a integer ya que la queryString devuelve cualquier numero como string...
      const skip = parseInt(req.query.skip);
      const sort = req.query.sort;
      let fields = req.query.fields;
      const distinct = req.query.distinct || "name";

      let filter = {};
      
      // Eliminamos el campo __v que añade MongoDB por defecto
      (typeof fields === 'undefined') ? fields = '-__v' : fields += ' -__v';
  
      if (typeof name !== 'undefined') {
          filter.name = { $regex: '^' + name, $options: 'i' }; //Filtrará por algo que comience por el nombre introducido, sin diferenciar entre mayúsculas y minúsculas
      }

      const docs = await Tag.lista(filter, limit, skip, sort, fields, distinct); //http://localhost:3000/api/v1/tags?name=work
      
      //res.json(docs);

      res.render('tags', {
        title: 'NodePOP',
        data: docs,
      });
          
  } catch (err) {
      next(err);
  }
});

// router.get('/', async function (req, res, next) {
//   try {
//     // let queryparams = '';
//     // for (let i = 1; i < req.url.length; i++){
//     //   queryparams += req.url[i];
//     //   console.log("queryparams:", queryparams);
//     // }

//     /**
//      * http://localhost:3000/?name=ip&sell=1
//      * req.url: /?name=ip&sell=1
//      */
//     const queryparams = req.url; // req.url: /?name=ip&sell=1

//     console.log("req.url:", req.url);
//     console.log("req.url.length:", req.url.length);
//     console.log("queryparams:", queryparams);

//     const ads = await getAds(queryparams);

//     res.render('index', {
//       title: 'NodePOP',
//       data: ads,
//     });
//   }
//   catch (err) {
//     // //console.log("err (./routes/index.js):", err);
//     console.log("Error en ./routes/index.js:");
//     // //console.log("Error:", error);
//     // console.log("Error (err.response.data):", err.response.data);
//     next(err);

//     //validationResult(req).throw();
//   }
// });

module.exports = router;