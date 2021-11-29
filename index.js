const express = require('express');
const conectarDB = require('./config/db');
const router = require('./routes');

//creando el servidor
const app = express();

//conectamos ala db
conectarDB();

//habilitamos express.json
app.use(express.json({extended:true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

//importamos nuestras rutas
app.use('/', router());

//arrancamos la app
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});