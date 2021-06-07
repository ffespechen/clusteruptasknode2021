const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require('./helpers');

// Crear la conexión a la base de datos
const db = require('./config/db');
// Importo el modelo
require('./models/Proyectos');

db.sync()
  .then(() => {
    console.log('Conectado al servidor');
  })
  .catch((error) => {
    console.log(error.message);
  });

// Crear una aplicación de express
const app = express();

// Dónde cargar los archivos estáticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

// Añadir la carpeta de vistas
app.set('views', path.join(__dirname, './views'));

// Agrego el helpers y lo dejo disponible para toda la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  next();
});

// Habilitar el Parseo para leer los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes());
// Definir el puerto al que escucha

const port = 3000;
app.listen(port);
