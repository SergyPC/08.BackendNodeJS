'use strict';

/**
 * Controlador de Tags de mi API
 * (Fichero de Rutas de Tags)
 * CRUD de tags (Create, Read, Update y Delete de tags)
 */

const express = require('express');
const router = express.Router();

// Cargamos y utilizamos el modelo de Tag para utilizar los diferentes métodos del API (GET, POST, PUT, DELETE...)
const Tag = require('../../../models/Tag');

//Validaciones En el middleware: Destructuring:
const { query, check, validationResult } = require('express-validator');

/**
 * GET /api/tags
 * Devuelve una lista de tags
 * http://localhost:3000/api/v1/tags
 */
// Creamos un middleware para que nos devuelva en http://localhost:3000/api/v1/tags un JSON con los diferentes docs encontrados
    // [
    //     "lifestyle",
    //     "mobile",
    //     "motor",
    //     "work"
    // ]
router.get('/', async (req, res, next) => {
    try {
        //const docs = await Tag.find(); 
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
    
        if (typeof name !== 'undefined') { //if (name) {
            //filtro.name = name;
            filter.name = { $regex: '^' + name, $options: 'i' }; //Filtrará por algo que comience por el nombre introducido, sin diferenciar entre mayúsculas y minúsculas
        }

        const docs = await Tag.lista(filter, limit, skip, sort, fields, distinct); //http://localhost:3000/api/v1/tags?name=work
        
        res.json(docs);
            
    } catch (err) {
        // console.log ("err.stack:", err.stack);
        // console.log ("err.name:", err.name);
        next(err);
    }
});

module.exports = router;