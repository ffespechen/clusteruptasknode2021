const express = require('express');
const router = express.Router();

// Importamos Express-Validator
const { body } = require('express-validator');

// Importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');

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
  router.patch('/tareas/:id', tareasController.cambiarEstadoTarea);
  router.delete('/tareas/:id', tareasController.eliminarTarea);

  // Crear Cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);

  return router;
};
