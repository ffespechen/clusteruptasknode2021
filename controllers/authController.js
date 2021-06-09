const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios',
});

// Función para verificar si el usuario está autenticado
exports.usuarioAutenticado = (req, res, next) => {
  // Si el usuario está autenticado, adelante
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/iniciar-sesion');
};

exports.cerrarSesion = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  });
};
