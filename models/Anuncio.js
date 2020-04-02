'use strict';

/**
 * Modelo Anuncio
 */

// Cargamos Mongoose
const mongoose = require('mongoose');

// 1) Crear un esquema
// https://mongoosejs.com/docs/schematypes.html
const anuncioSchema = mongoose.Schema({
	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
    tags: [String],
    //message: mongoose.Schema.Types.Mixed, //Recogerá cualquier tipología en esta propiedad
});

// Nos creamos un método estático (Sería como un prototype sobre anuncioSchema)
anuncioSchema.statics.lista = function (filtro, limit, skip, sort, fields) {
    //return Anuncio.find(filtro); //Cuando no existía el limit
    const query = Anuncio.find(filtro);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    query.select(fields);
    return query.exec();
};

// 2) Con el esquema, creamos un modelo (<nombreDelModelo>, <esquemaQueNosHemosCreado>)
/**
 * IMPORTANTE:
 * El nombre del modelo debe estar la primera en singular y en MAYUSCULAS (Anuncio)
 * Y tu colección de la BBDD se llama agentes (en plurar y en minusculas)
 * El nombre del modelo y el nombre de la colección debe coincidir (Agente/agentes) para que pueda localizarlo en la BBDD.
 * Mongoose, lo que hace, es el nombre que le ponemos en 'Anuncio' lo trata como si estuviera en minúsculas y pluralizada [Anuncio -> anuncios], 
 *           y ese es el nombre que va a buscar en la BBDD (db.anuncios)
 * Plural: https://mongoosejs.com/docs/models.html
 */
const Anuncio = mongoose.model('Anuncio', anuncioSchema); //mongoose pluraliza y lo pone en minusculas [Anuncio -> anuncios] (buscando en la BBDD agentes)

// 3) Exportamos el modelo
module.exports = Anuncio;