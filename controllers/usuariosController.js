const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en UpTask',
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar Sesión en UpTask',
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  // Leer los datos
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password,
    });

    // crear una URL de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // crear el objeto de usuario
    const usuario = {
      email,
    };

    // Enviar el mail
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirmar tu cuenta',
      confirmarUrl,
      archivo: 'confirmar-cuenta',
    });

    // Redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    console.error(error);
    req.flash(
      'error',
      error.errors.map((error) => error.message)
    );
    res.render('crearCuenta', {
      nombrePagina: 'Crear cuenta en UpTask',
      mensajes: req.flash(),
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res, next) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu constraseña',
  });
};

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });

  if (!usuario) {
    req.flash('error', 'No válido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada');
  res.redirect('/iniciar-sesion');
};
