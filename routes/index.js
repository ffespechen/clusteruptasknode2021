const express = require('express');
const router = express.Router();

// Importamos Express-Validator
const { body } = require('express-validator');

// Importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// Middleware
module.exports = function () {
  // Ruta para el home
  router.get(
    '/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  //  Ruta para el nuevo proyecto
  router.get(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  router.post(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').trim().not().isEmpty().escape(),
    proyectosController.nuevoProyecto
  );

  // Modificar el nombre del proyecto
  router.post(
    '/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').trim().not().isEmpty().escape(),
    proyectosController.actualizarProyecto
  );

  // Listar Proyecto
  router.get(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );

  // Actualizar el proyecto
  router.get(
    '/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );

  // Eliminar Proyectos
  router.delete(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );

  // Tareas
  router.post(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );
  router.patch(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  router.delete(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Crear Cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  // Iniciar sesión
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  router.get('/cerrar-la-sesion', authController.cerrarSesion);

  router.get('/reestablecer', usuariosController.formRestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);

  return router;
};
