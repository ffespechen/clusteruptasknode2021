const express = require('express');
const router = express.Router();

// Importamos Express-Validator
const { body } = require('express-validator');

// Importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');

// Middleware
module.exports = function () {
  // Ruta para el home
  router.get('/', proyectosController.proyectosHome);
  //  Ruta para el nuevo proyecto
  router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
  router.post(
    '/nuevo-proyecto',
    body('nombre').trim().not().isEmpty().escape(),
    proyectosController.nuevoProyecto
  );

  // Modificar el nombre del proyecto
  router.post(
    '/nuevo-proyecto/:id',
    body('nombre').trim().not().isEmpty().escape(),
    proyectosController.actualizarProyecto
  );

  // Listar Proyecto
  router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

  // Actualizar el proyecto
  router.get('/proyecto/editar/:id', proyectosController.formularioEditar);

  // Eliminar Proyectos
  router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

  // Tareas
  router.post('/proyectos/:url', tareasController.agregarTarea);

  return router;
};
