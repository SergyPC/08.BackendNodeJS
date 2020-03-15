var express = require('express');
var router = express.Router();

/* Middleware */
// router.get y router.use es lo mismo
// Ponerle .get es un filtro más: Es decirle a Express sólo cuando la petición sea de tipo GET y sea a la raiz de este middleware, entonces le pasas el request a este middleware que hay aquí
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); //renderiza la vista index y le vas a pasar el siguiente objeto ({...}) a la vista ./views/index.ejs o html
});

module.exports = router;
