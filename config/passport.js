const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local-estrategy - Login con credenciales propias
passport.use(
  new LocalStrategy(
    // Por default espera un usuario y password
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1,
          },
        });

        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password Incorrecto',
          });
        }

        done(null, usuario);
      } catch (error) {
        // Ese usuario no existe
        return done(null, false, {
          message: 'Esa cuenta no existe',
        });
      }
    }
  )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
