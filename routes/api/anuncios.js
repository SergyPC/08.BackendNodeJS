'use strict';

/**
 * Controlador de Anuncios de mi API
 * (Fichero de Rutas de Anuncios)
 */

const express = require('express');
const router = express.Router();

// Cargamos y utilizamos el modelo de Agente para utilizar los diferentes métodos del API (GET, POST, PUT, DELETE...)
const Anuncio = require('../../models/Anuncio');

//Validaciones En el middleware: Destructuring:
const { query, check, validationResult } = require('express-validator');

// Creamos un middleware para que nos devuelva en http://localhost:3000/api/anuncios un Json con los docs encontrados
// usando un arrow function
// router.get('/', (req, res, next) => {
//     Anuncio.find().exec((err, docs) => {
//       res.json(docs);
//     });
// });

/**
 * GET /api/anuncios
 * Devuelve una lista de anuncios
 * http://localhost:3000/api/anuncios
 */
// Creamos un middleware para que nos devuelva en http://localhost:3000/api/anuncios un Json con los docs encontrados
// usando una promesa async / away
router.get('/', async (req, res, next) => { //http://localhost:3000/api/anuncios
// router.get('/', [
//     //query('precio').isNumeric().withMessage('debería ser numérico'),
//     check('precio').isNumeric().withMessage('debería ser numérico'),
// ], async (req, res, next) => { //http://localhost:3000/api/anuncios
    try {
        //validationResult(req).throw(); // lanza excepción si hay errores de validación

        //const docs = await Anuncio.find(); 
        const nombre = req.query.nombre;
        const venta = req.query.venta;
         
        const precio = req.query.precio;
        
        const foto = req.query.foto;
        const tags = req.query.tags;
        // Si no hay req.query.limit (No lo han añadido) devuelve como máximo 10.000
        const limit = parseInt(req.query.limit || 10000); //Lo convertimos a integer ya que la queryString devuelve cualquier numero como string...
        // console.log(limit); // http://localhost:3000/api/agentes devolvería: NaN
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        const fields = req.query.fields;

        // console.log("req.query.precio:", req.query.precio);
        // console.log("precio:", precio);

        //const filtro = {};
        let filtro = {};
        const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
        let isIncorrectPrice = false;
        
        // if(regExpNumbers.test("a123000.000000"))
        //     console.log("Correcto")
        // else
        //     console.log("Incorrecto")

        
        if (typeof nombre !== 'undefined') { //if (nombre) {
            filtro.nombre = nombre;
        }

        if (typeof venta !== 'undefined') { //if (venta) {
            filtro.venta = venta;
        }

        if (typeof precio !== 'undefined') { //if (precio) {
            if (regExpNumbers.test(precio)) 
                filtro.precio = parseInt(precio);
            else
                isIncorrectPrice = true;
        }

        if (typeof foto !== 'undefined') { //if (foto) {
            filtro.foto = foto;
        }

        if (typeof tags !== 'undefined') { //if (tags) {
            filtro.tags = tags;
        }

        let docs;
        if (isIncorrectPrice) //Si han añadido un precio que no es numérico
            docs = []; //http://localhost:3000/api/anuncios?nombre=iPhone
        else 
            docs = await Anuncio.lista(filtro, limit, skip, sort, fields); //http://localhost:3000/api/anuncios?nombre=iPhone
        
        //const docs = await Anuncio.lista(filtro, limit, skip, sort, fields); //http://localhost:3000/api/anuncios?nombre=iPhone
        res.json(docs);
        

        
    } catch (err) {
        // console.log ("err.stack:", err.stack);
        // console.log ("err.name:", err.name);
       
        next(err);
    }
});

// Creamos un middleware para que nos devuelva en http://localhost:3000/api/anuncios/5e7f5873ef51c93f502f4fa8 un Json con un único anuncio
// usando una promesa async away
/**
 * GET /api/anuncios/:id
 * Busca un anuncio por id y lo devuelve
 * http://localhost:3000/api/anuncios/5e7f5873ef51c93f502f4fa8
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
            //Las 2 líneas anteriores se pueden poner: return next(err);
        }
        res.json( { result: anuncio } );
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/anuncios
 * Crea un anuncio
 * http://localhost:3000/api/anuncios
 */
//Para probar el POST ejecutarlo en Postman
    // POST > http://localhost:3000/api/anuncios
    // Pestaña Body:
        // (.) x-www-form-urlencoded
            // KEY		VALUE
            // nombre	Camiseta Lacoste
            // venta	true
            // precio   22.15
            // foto     camiseta.jpg
            // tags     lifestyle
router.post('/', async (req, res, next) => { 
    try {
        //recogemos por el body los datos del anuncio a crear
        const anuncioData = req.body;
    
        // Creamos el objeto en memoria
        const anuncio = new Anuncio(anuncioData); // Le pasamos al constructor Anuncio los datos recibidos por el body
        
        // Guardamos en la BBDD el objeto en memoria
        // la función save podría utilizarse con un callback o como una promesa.
        // Al utilizarlo como promesa nos devuelve el objeto que finalmente ha añadido a la BBDD.
        const anuncioGuardado = await anuncio.save();
        
        // Y es lo que le vamos a devolver (anuncioGuardado) a quién nos haya hecho la petición al API
        //res.json( { result: anuncioGuardado } ); // Esta respuesta devuelve un codigo de estado 200
        res.status(201).json( { result: anuncioGuardado } ); // Esta respuesta devuelve un codigo de estado 201
    } catch (err) {
        next(err);
    }
});

module.exports = router;