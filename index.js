const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Crear la conexión a la base de datos
const db = require('./config/db');
// Importo el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
  .then(() => {
    console.log('Conectado al servidor');
  })
  .catch((error) => {
    console.log(error.message);
  });

// Crear una aplicación de express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Añadir la carpeta de vistas
app.set('views', path.join(__dirname, './views'));

// Habilitar el Parseo para leer los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dónde cargar los archivos estáticos
app.use(express.static('public'));

// Agregar Flash
app.use(flash());

// Cookies
app.use(cookieParser());

// Sesiones
app.use(
  session({
    secret: 'firma_del_cookie',
    resave: false,
    saveUninitialized: false,
  })
);

// Uso de passport para autenticación
app.use(passport.initialize());
app.use(passport.session());

// Agrego el helpers y lo dejo disponible para toda la app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  next();
});

app.use('/', routes());
// Definir el puerto al que escucha

const port = 3000;
app.listen(port);
