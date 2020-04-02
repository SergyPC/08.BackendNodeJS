# NodePOP

## Installation

(NodePOP requires [Node.js](https://nodejs.org/) v4+ to run)

```shell
npm install
```

To initialize the database you can run:

```shell
npm run install-db
```

<br />

## Start project

To start the project use:

- In production:
```shell
npm start
```
- In development:
```shell
npm run dev
```

<br />

## Page Routes

* http://localhost:3000/
* http://localhost:3000/anuncios
* http://localhost:3000/tags

<br />

## API Routes

* http://localhost:3000/apiv1/anuncios

Returns the list of articles in JSON format:
```shell
[
  {
    "tags": [
      "lifestyle",
      "motor"
    ],
    "_id": "5e7f5873ef51c93f502f4fa8",
    "nombre": "Bicicleta eléctrica Rodars 1000W",
    "venta": true,
    "precio": 230.15,
    "foto": "bicicleta.jpg",
    "__v": 0
  },
  {
    "tags": [
      "lifestyle",
      "mobile"
    ],
    "_id": "5e7f5873ef51c93f502f4fa9",
    "nombre": "iPhone 11Pro",
    "venta": true,
    "precio": 50,
    "foto": "iphone-11-pro.jpg",
    "__v": 0
  },
  {
    "tags": [
      "lifestyle",
      "motor"
    ],
    "_id": "5e7f5873ef51c93f502f4faa",
    "nombre": "Aston Martin DBS",
    "venta": true,
    "precio": 225630.55,
    "foto": "aston-martin-dbs.jpg",
    "__v": 0
  },
  {
    "tags": [
      "lifestyle",
      "work"
    ],
    "_id": "5e7f5873ef51c93f502f4fab",
    "nombre": "MacBook Air",
    "venta": false,
    "precio": 250.5,
    "foto": "apple-macbook-air.jpg",
    "__v": 0
  },
  {
    "tags": [
      "lifestyle",
      "work"
    ],
    "_id": "5e7f5873ef51c93f502f4fac",
    "nombre": "TV Samsung 4K UHD",
    "venta": false,
    "precio": 4250,
    "foto": "TV-Samsung-49NU7305.jpg",
    "__v": 0
  }
]
```

<br />

## More information

### To start a MongoDB server from console:

<!-- https://www.mongodb.com/download-center/community -->

```shell
./bin/mongod --dbpath ./data/db --directoryperdb
```
Only for operating systems that do not have it installed as a service (MongoDB, in Windows, is installed as a default service).

<br />

## API Rest

As a backend server we will use a Rest API in the cloud with the following address:
http://localhost:3000/

<br />

## API Methods

### List of advertisements

GET /apiv1/anuncios

```shell
// Endpoint: /apiv1/anuncios
// It's a GET method that optionally through query string allows the following data:

[
    {
        [nombre]: string,
        [venta]: boolean,
        [precio]: number,
        [foto]: string,
        [tags]: array,

        [limit]: number,
        [skip]: number,
        [fields],
        [sort]
    },
    {
        ...
    }
]
```

** Default limit is 10.000 **

Will return the following:

```shell
// If everything goes well
{
   success: true,
   result: Array
}

// f any error happens
{
   success: false,
   error: ...
}
```

Filtrado de anuncios
<br />
Puedes incluir filtros en la URL añadiendo parametros especiales a la consulta. Para comenzar con el filtrado incorpora el carácter `?` seguido de las queries a incorporar
en el siguiente formato `<query>=<value>`. Si necesitas encadenar varias consultas puedes utilizar el carácter `&`.


Ejemplos de consultas:

- Todos los anuncios que contienen el tag lifestyle: http://34.89.93.186:8080/apiv1/anuncios?tag=lifestyle:
- Todos los anuncios con price entre 1 y 100: http://34.89.93.186:8080/apiv1/anuncios?price=1-100
- Las dos consultas anteriores combinadas: http://34.89.93.186:8080/apiv1/anuncios?tag=lifestyle&price=1-100
- Precio entre 1 y 100 de anuncios que empiecen por ‘Com’: http://34.89.93.186:8080/apiv1/anuncios?price=1-100&name=Com
- Sólo los anuncios de venta: http://34.89.93.186:8080/apiv1/anuncios?venta=true
- Sólo los anuncios de compra: http://34.89.93.186:8080/apiv1/anuncios?venta=false


Los parámetros disponibles para filtrado son:

- name: filtrado por los que empiecen con el string indicado (la API NO es case sensitive).
- price: filtrar por precio. Entre un rango x-y, menores a un precio x-, o mayores a un precio -y.
- tag: permite filtrar los anuncios que tengan el tag indicado.
- venta: permite filtrar por anuncios de venta (=true), o anuncios de compra (=false)
- skip: permite saltar resultados (utilizado para paginar junto con limit)
- limit: permite limitar el número de resultados devueltos
- fields: campos a mostrar del anuncio


Ejemplo de consulta

http://34.89.93.186:8080/apiv1/anuncios?price=1-100&venta=false

```shell
{
  "success": true,
  "results": [
    {
      "_id": "5d3a0a5f9bd7ed2ece463abc",
      "nombre": "Comba de Crossfit",
      "venta": true,
      "precio": 13.50,
      "foto": "comba.jpg",
      "tags": [
        "lifestyle", "mobile", "motor", "work"
      ],
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z",
      "__v": 0
    },
    {
      ...
    },
    {
      ...
    }
  ]
}
```



<!-- (HABRÍA QUE DOCUMENTAR AQUÍ LOS FILTROS QUE HEMOS HECHO...) -->

GET /apiv1/anuncios/:id

POST /apiv1/anuncios

PUT /apiv1/anuncios
