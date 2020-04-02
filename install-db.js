'use strict';

/**
 * Script para inicializar la colección de Anuncios.
 * Nos servirá para desplegar por primera vez nuestro proyecto en una maquina.
 * Una vez descargado el proyecto en nuestro ordenador (O al desplegarlo en PRE/PRO), ejecutaremos este script para que nos cree los datos iniciales de partida de la BBDD.
 * Lo utilizaremos una vez normalmente a no ser que queramos resetear la BBDD.
 */

// Usamos el conector de Mongoose
const conn = require('./lib/connectMongoose');

// Cargamos el modelo de Anuncio
const Anuncio = require('./models/Anuncio');

// Una vez establecida la conexión a la BBDD, ejecutamos esta función asincrona para inicializar las colecciones que nos interesen:
conn.once('open', async () => {
    try {
        await initAnuncios();
        conn.close();
    } catch (err) {
        console.error('Hubo un error en la inicialización de las colecciones:', err);
        process.exit(1);
    }
});

// Función para inicializar Anuncios
// Devolverá una promesa
async function initAnuncios() {
    await Anuncio.deleteMany(); //Borra todos los registros de la tabla anuncios
    await Anuncio.insertMany([  //Añadimos los registros que queramos inicializar por defecto
        { nombre: 'Bicicleta eléctrica Rodars 1000W', venta: true, precio: 230.15, foto: 'bicicleta.jpg', tags: ['lifestyle', 'motor'] },
        { nombre: 'iPhone 11Pro', venta: true, precio: 50.00, foto: 'iphone-11-pro.jpg', tags: ['lifestyle', 'mobile'] },
        { nombre: 'Aston Martin DBS', venta: true, precio: 225630.55, foto: 'aston-martin-dbs.jpg', tags: ['lifestyle', 'motor'] },
        { nombre: 'MacBook Air', venta: false, precio: 250.50, foto: 'apple-macbook-air.jpg', tags: ['lifestyle', 'work'] },
        { nombre: 'TV Samsung 4K UHD', venta: false, precio: 4250.00, foto: 'TV-Samsung-49NU7305.jpg', tags: ['lifestyle', 'work'] },
    ]);
}

// "tags": [ "lifestyle", "motor", "mobile", "work"]

// const anuncioSchema = mongoose.Schema({
// 	nombre: String,
// 	venta: Boolean,
// 	precio: Number,
// 	foto: String,
// 	tags: [String],
// });