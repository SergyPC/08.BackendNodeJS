'use strict';

/**
 * Controlador de Anuncios de mi API
 * (Fichero de Rutas de Anuncios)
 * CRUD de anuncios (Create, Read, Update y Delete de anuncios)
 */

const express = require('express');
const router = express.Router();

// Cargamos y utilizamos el modelo de Anuncio para utilizar los diferentes métodos del API (GET, POST, PUT, DELETE...)
const Anuncio = require('../../../models/Anuncio');

//Validaciones En el middleware: Destructuring:
const { query, check, validationResult } = require('express-validator');

/**
 * GET /api/v1/anuncios
 * Devuelve una lista de anuncios (el limite máximo por defecto es 100) pudiendo utilizar filtros
 * http://localhost:3000/api/v1/anuncios
*/
router.get('/', async (req, res, next) => { 
    try {
        const name = req.query.name;
        const sell = req.query.sell;
        const price = req.query.price;
        const tags = req.query.tags;
        const limit = parseInt(req.query.limit || 100); // Si no hay req.query.limit (No lo han añadido) devuelve como máximo 100 documentos //Lo convertimos a integer ya que la queryString devuelve cualquier numero como string...
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        let fields = req.query.fields;
        let filter = {};
        let isIncorrectPrice = false;
        
        // Eliminamos el campo __v que añade MongoDB por defecto
        //(typeof fields === 'undefined') ? fields = '-__v' : fields += ' -__v';

        //Sólo permito eliminar el campo '-__v'
        (typeof fields === 'undefined') ? fields = '-__v' : fields = '-__v'; 

        if (typeof name !== 'undefined') { 
            filter.name = { $regex: '^' + name, $options: 'i' }; //Filtrará por algo que comience por el nombre introducido, sin diferenciar entre mayúsculas y minúsculas
        }

        if (typeof sell !== 'undefined') { 
            if (sell !== 'true' && sell !== 'false' && sell !== '1' && sell !== '0') { //Si han añadido un valor que no es boolean
                const err = new Error('The sell should be boolean (true or false).'); //La venta debería ser boolean.
                err.status = 422;
                next(err);
                return;
            }
            filter.sell = sell;
        }

        /**
         * Permite múltiples precios:
         * ● 10-50 buscará anuncios con precio incluido entre estos valores { price: { '$gte': '10', '$lte': '50' } }
         * ● 10- buscará los que tengan precio mayor que 10 { price: { '$gte': '10' } }
         * ● -50 buscará los que tengan precio menor de 50 { price: { '$lte': '50' } }
         * ● 50 buscará los que tengan precio igual a 50 { price: '50' }
         */
        if (typeof price !== 'undefined') { 
            const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
            const rango = price.split('-');
            if (rango.length === 1) { //price=50
                (regExpNumbers.test(price) && price.indexOf(',') === -1) ? filter.price = parseFloat(price) : isIncorrectPrice = true;
            }
            else if (rango.length === 2) { //Si contiene algún guión
                if(price.startsWith('-', 0)) { //price=-50
                    (regExpNumbers.test(rango[1]) && rango[1].indexOf(',') === -1) ? filter.price = { $lte: parseFloat(rango[1]) } : isIncorrectPrice = true;
                } 
                else {
                    if (!rango[1]) { //price=10-
                        (regExpNumbers.test(rango[0]) && rango[0].indexOf(',') === -1) ? filter.price = { $gte: parseFloat(rango[0]) } : isIncorrectPrice = true;
                    }
                    else { //price=10-50
                        ((regExpNumbers.test(rango[0]) && rango[0].indexOf(',') === -1) && (regExpNumbers.test(rango[1]) && rango[1].indexOf(',') === -1)) ? filter.price = { $gte: parseFloat(rango[0]), $lte: parseFloat(rango[1]) } : isIncorrectPrice = true;
                    }
                }
            } 
            else { //Si contiene 3 o más valores
                isIncorrectPrice = true;
            }
        }

        /**
         * Permite múltiples tag:
         * ● Separados por coma: tags=work,lifestyle
         * ● Separados por espacio: tags=work lifestyle
         */
        if (typeof tags !== 'undefined') { //if (tags) {
            let arrayTags;
            if (tags.indexOf(' ') != -1)
                arrayTags = tags.split(' ');
            else if (tags.indexOf(',') != -1)
                arrayTags = tags.split(',');
            else
                arrayTags = tags;
            filter.tags = { "$in": arrayTags};
        }

        //let docs;
        if (isIncorrectPrice) { //Si han añadido un precio que no es numérico
            //docs = [];
            const err = new Error('The price should be numeric.'); //El precio debería ser numérico.
            err.status = 422;
            next(err);
            return;
        }
        //else // Creamos un método estático, lista, en el modelo Anuncio.js
        //    docs = await Anuncio.lista(filter, limit, skip, sort, fields); //http://localhost:3000/api/v1/anuncios?name=iPhone
        
        const docs = await Anuncio.lista(filter, limit, skip, sort, fields); //http://localhost:3000/api/v1/anuncios?name=iPhone
        res.json(docs);
        
    } catch (err) {
        next(err);
    }
});



/**
 * GET /api/v1/anuncios/:id
 * Busca un anuncio por id y lo devuelve en formato JSON
 * http://localhost:3000/api/v1/anuncios/5e7f5873ef51c93f502f4fa8
 */
router.get('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const regExpIsIDMongoDB = new RegExp("^[0-9a-fA-F]{24}$");
        //const anuncio = await Anuncio.findOne({ _id: _id }); // Es lo mismo: //const anuncio = await Anuncio.findOne({ _id });
        
        let anuncio;
        if (regExpIsIDMongoDB.test(_id))
            anuncio = await Anuncio.findOne({ _id: _id }); // Es lo mismo: //const anuncio = await Anuncio.findOne({ _id });
        
        // Si ponemos este if devuelve un 404 si no encuentra ese id en lugar de NULL
        if (!anuncio) {
            // err.status(404).json({}); //Devolvería un objeto vacío {} y un error 404
            // return;
            const err = new Error('Not found');
            err.status = 404;
            next(err);
            return;
        }
        res.json( { result: anuncio } );
    } catch (err) {
        next(err);
    }
});


/**
 * POST /api/v1/anuncios
 * Crea un anuncio y lo devuelve en formato JSON
 * http://localhost:3000/api/v1/anuncios
 */
// Para probar el POST ejecutarlo en Postman
    // POST > http://localhost:3000/api/v1/anuncios
    // En la Pestaña Body (Pasamos la información que queremos insertar para ese documento):
        // (•) x-www-form-urlencoded
            // KEY		    VALUE
            // name	        Camiseta Lacoste
            // sell 	    true
            // price        22.15
            // photo        camiseta.jpg
            // tags         lifestyle
            // detail       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
            // createdAt    2020-04-05T18:14:40.759Z
            // updatedAt    2020-04-05T18:14:40.759Z
router.post('/',
    [
        check('name').isString().withMessage('should be string'),
        check('sell').isBoolean().withMessage('should be boolean'),
        check('price').isNumeric().withMessage('should be numeric'),
        check('photo').isString().withMessage('should be string'),
        check('detail').isString().withMessage('should be string'),
    ],
    async (req, res, next) => {
    try {
        validationResult(req).throw(); // lanza excepción si hay errores de validación
        
        let anuncioData = req.body; //recogemos por el body los datos del anuncio a crear
        const tags = req.body.tags;
        const sell = req.body.sell;
        const price = req.body.price;
        let failure = false;
        
        const RegexImageExtension = RegExp("\.(gif|jpe?g|tiff|png|webp|bmp)$");
        if (!(RegexImageExtension.test(req.body.photo.toLowerCase()))) { //Imagen Incorrecta
            const err = new Error(`Not valid (${req.body.photo}). The allowed extensions for photo are: gif|jpg|jpeg|tiff|png|webp|bmp`); //Not valid. Las extensiones permitidas para una imagen son: gif|jpg|jpeg|tiff|png|webp|bmp
            err.status = 422;
            next(err);
            return;
        }

        if (sell !== 'true' && sell !== 'false' && sell !== '1' && sell !== '0') { //Si han añadido un valor que no es boolean
            const err = new Error('The sell should be boolean (true or false).'); //La venta debería ser boolean.
            err.status = 422;
            next(err);
            return;
        }

        const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
        if (!(regExpNumbers.test(price)) || price.indexOf(',') !== -1) { //Si han añadido un precio que no es numérico
            const err = new Error('The price should be numeric.'); //El precio debería ser numérico.
            err.status = 422;
            next(err);
            return;
        }
        
        if (typeof tags !== 'undefined') {
            const tagsPermitidos = [ "lifestyle", "motor", "mobile", "work"];
            if (typeof tags !== 'object') {
                if (tags !== tagsPermitidos[0] && tags !== tagsPermitidos[1] && tags !== tagsPermitidos[2] && tags !== tagsPermitidos[3])
                    failure = true;
            } else {
                tags.forEach(tag => {
                    if (tag !== tagsPermitidos[0] && tag !== tagsPermitidos[1] && tag !== tagsPermitidos[2] && tag !== tagsPermitidos[3])
                        failure = true;               
                });
            }
        }
        else
            failure = true;

        if (failure) {
            const err = new Error(`Not valid (${tags}). The allowed values for tags are: 'lifestyle', 'motor', 'mobile', 'work'`); //Not valid. Los valores permitidos para tags son: 'lifestyle', 'motor', 'mobile', 'work';
            err.status = 422;
            next(err);
            return;
        }

        const date = new Date();
        anuncioData.createdAt = date;
        anuncioData.updatedAt = date;
    
        // Creamos el objeto en memoria
        const anuncio = new Anuncio(anuncioData); // Le pasamos al constructor Anuncio los datos recibidos por el body

        // Guardamos en la BBDD el objeto en memoria
        // la función save podría utilizarse con un callback o como una promesa.
        // Al utilizarlo como promesa nos devuelve el objeto que finalmente ha añadido a la BBDD.
        const anuncioGuardado = await anuncio.save();
        
        // Y es lo que le vamos a devolver (anuncioGuardado) a quién nos haya hecho la petición al API
        //res.json( { result: anuncioGuardado } ); // Esta respuesta devuelve un codigo de estado 200
        res.status(201).json( { result: anuncioGuardado } ); // Esta respuesta devuelve un codigo de estado 201: Success - Created
    } catch (err) {
        next(err);
    }
});


/**
 * PUT /api/v1/anuncios/:id
 * Actualiza un anuncio en la base de datos y nos lo devuelve en formato JSON
 * http://localhost:3000/api/v1/anuncios/5e821c1730858334c486e073
 */
// Para probar el PUT ejecutarlo en Postman
    // PUT > http://localhost:3000/api/v1/anuncios/5e821c1730858334c486e073
    // En la Pestaña Body (Pasamos la información que queremos actualizar):
        // (•) x-www-form-urlencoded
            // KEY		    VALUE
            // name	        Camiseta Lacoste
            // sell 	    true
            // price        22.15
            // photo        camiseta.jpg
            // tags         lifestyle
            // detail       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
            // createdAt    2020-04-05T18:14:40.759Z
            // updatedAt    2020-04-05T18:14:40.759Z
router.put('/:id', async(req, res, next) => {
    try {
        const _id = req.params.id; //recogemos como parámetro el identificador del anuncio que queremos modificar
        const anuncioData = req.body; //recogemos del body los datos del anuncio a actualizar
        const photo = req.body.photo;
        const price = req.body.price;
        const sell = req.body.sell;
        //const anuncioActualizado = await Anuncio.findByIdAndUpdate(_id, anuncioData); //Actualiza el anuncio y Nos devuelve el anuncio antes de actualizarlo
        
        if (typeof photo !== 'undefined') { 
            const RegexImageExtension = RegExp("\.(gif|jpe?g|tiff|png|webp|bmp)$");
            if (!(RegexImageExtension.test(req.body.photo.toLowerCase()))) { //Imagen Incorrecta
                const err = new Error(`Not valid (${req.body.photo}). The allowed extensions for photo are: gif|jpg|jpeg|tiff|png|webp|bmp`); //Not valid. Las extensiones permitidas para una imagen son: gif|jpg|jpeg|tiff|png|webp|bmp
                err.status = 422;
                next(err);
                return;
            }
        }

        if (typeof sell !== 'undefined'){
            if (sell !== 'true' && sell !== 'false' && sell !== '1' && sell !== '0') { //Si han añadido un valor que no es boolean
                const err = new Error('The sell should be boolean (true or false).'); //La venta debería ser boolean.
                err.status = 422;
                next(err);
                return;
            }
        }    

        if (typeof price !== 'undefined') {
            const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
            if (!(regExpNumbers.test(price)) || price.indexOf(',') !== -1) { //Si han añadido un precio que no es numérico
                const err = new Error('The price should be numeric.'); //El precio debería ser numérico.
                err.status = 422;
                next(err);
                return;
            }
        }

        const tags = req.body.tags;
        let failure = false;
        if (typeof tags !== 'undefined') {
            const tagsPermitidos = [ "lifestyle", "motor", "mobile", "work"];
            if (typeof tags !== 'object') {
                if (tags !== tagsPermitidos[0] && tags !== tagsPermitidos[1] && tags !== tagsPermitidos[2] && tags !== tagsPermitidos[3])
                    failure = true;
            } else {
                tags.forEach(tag => {
                    if (tag !== tagsPermitidos[0] && tag !== tagsPermitidos[1] && tag !== tagsPermitidos[2] && tag !== tagsPermitidos[3])
                        failure = true;               
                });
            }
        }

        if (failure) {
            const err = new Error(`Not valid (${tags}). The allowed values for tags are: 'lifestyle', 'motor', 'mobile', 'work'`); //Not valid. Los valores permitidos para tags son: 'lifestyle', 'motor', 'mobile', 'work';
            err.status = 422;
            next(err);
            return;
        }

        const date = new Date();
        anuncioData.updatedAt = date;

        const anuncioActualizado = await Anuncio.findOneAndUpdate({_id: _id}, anuncioData, { 
            new: true, //Le decimos que nos devuelva el nuevo anuncio actualizado cuyo id = id pasado como parámetro
            useFindAndModify: false, //Esta opción hay que añadirla para futuras versiones de Mongoose
        }); //Actualiza el anuncio y Nos devuelve el anuncio actualizado
        
        res.status(200).json({ result: anuncioActualizado }); //Response code 200: Success - OK
        //res.json({ result: anuncioActualizado });
    } catch (err) {
        next(err);
    }
});


/**
 * DELETE /api/v1/anuncios/:id
 * Elimina un anuncio y nos devuelve un Status 200 (Success OK)
 * http://localhost:3000/api/v1/anuncios/5e8219748b397949d0ad853b
 */
// Para probar el DELETE ejecutarlo en Postman
    // DELETE > http://localhost:3000/api/v1/anuncios/5e8219748b397949d0ad853b
router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        await Anuncio.deleteOne({_id: _id}); //Es lo mismo a esto: await Anuncio.deleteOne({_id});
        // res.json({ ok: true }); //Al borrarlo, devolverá directamente un Status 200
        // res.json({ success: true }); //Al borrarlo, devolverá directamente un Status 200
        res.json(); //Al borrarlo, devolverá directamente un Status 200
    } catch (err) {
        next(err);
    }
});

module.exports = router;