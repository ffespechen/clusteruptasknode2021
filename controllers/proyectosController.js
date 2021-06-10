const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });
  res.render('index', {
    nombrePagina: 'PROYECTOS',
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });

  res.render('nuevoProyecto', {
    nombrePagina: 'NUEVO PROYECTO',
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });
  // Usando desestructuración, recupero los valores del campo
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Debe suministrar un nombre de proyecto' });
  }

  // Si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // Insertar DB
    // Proyectos.create({
    //   nombre,
    // })
    //   .then(() => console.log('Inserción exitosa'))
    //   .catch((err) => console.log(err.message));
    // Reemplazado por el hook en el model
    // const url = slug(nombre).toLowerCase();
    const usuarioId = res.locals.usuario.id;
    const proyecto = await Proyectos.create({
      nombre,
      usuarioId,
    });
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromesa = Proyectos.findAll({
    where: {
      usuarioId,
    },
  });
  const proyectoPromesa = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromesa,
    proyectoPromesa,
  ]);

  // Consultas tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    // include: [
    //   {
    //     model: Proyectos,
    //   },
    // ],
  });

  if (!proyecto) return next();

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromesa = Proyectos.findAll({
    where: {
      usuarioId,
    },
  });
  const proyectoPromesa = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromesa,
    proyectoPromesa,
  ]);

  res.render('nuevoProyecto', {
    nombrePagina: 'Editar Proyecto',
    proyecto,
    proyectos,
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId,
    },
  });
  // Usando desestructuración, recupero los valores del campo
  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Debe suministrar un nombre de proyecto' });
  }

  // Si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // Insertar DB
    // Proyectos.create({
    //   nombre,
    // })
    //   .then(() => console.log('Inserción exitosa'))
    //   .catch((err) => console.log(err.message));
    // Reemplazado por el hook en el model
    // const url = slug(nombre).toLowerCase();
    const proyecto = await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect('/');
  }
};

// Eliminar proyecto
exports.eliminarProyecto = async (req, res, next) => {
  // req, query o params
  const { urlProyecto } = req.query;
  const resultado = await Proyectos.destroy({
    where: {
      url: urlProyecto,
    },
  });

  if (!resultado) {
    return next();
  }

  res.status(200).send('Proyecto eliminado correctamente!');
};
