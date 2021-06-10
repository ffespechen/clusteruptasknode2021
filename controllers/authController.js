const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Op = require('sequelize').Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

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

exports.enviarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.body.email,
    },
  });

  // Si no hay usuario
  if (!usuario) {
    req.flash('error', 'No existe esa cuenta ');
    res.redirect('reestablecer');
  }

  // Genero el token y la fecha de expiración
  const token = crypto.randomBytes(20).toString('hex');
  usuario.token = token;
  usuario.expiracion = Date.now() + 3600000;

  // Lo almaceno en la base de datos
  await usuario.save();

  // url de reset
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // Envía el correo con el token

  await enviarEmail.enviar({
    usuario,
    subject: 'Password reset',
    resetUrl,
    archivo: 'reestablecer-password',
  });

  req.flash('correcto', 'Se envió un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/reestablecer');
  }

  res.render('resetPassword', {
    nombrePagina: 'Reestablecer contraseña',
  });
};

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/reestablecer');
  }

  // hashear el nuevo password
  usuario.token = null;
  usuario.expiracion = null;
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  await usuario.save();

  req.flash('correcto', 'Tu password se ha actualizado');
  res.redirect('/iniciar-sesion');
};
