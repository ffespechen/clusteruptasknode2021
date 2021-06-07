const Proyectos = require('../models/Proyectos');

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render('index', {
    nombrePagina: 'PROYECTOS',
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render('nuevoProyecto', {
    nombrePagina: 'NUEVO PROYECTO',
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
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
    const proyecto = await Proyectos.create({
      nombre,
    });
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const proyectosPromesa = Proyectos.findAll();
  const proyectoPromesa = Proyectos.findOne({
    where: {
      url: req.params.url,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromesa,
    proyectoPromesa,
  ]);

  if (!proyecto) return next();

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyecto,
    proyectos,
  });
};

exports.formularioEditar = async (req, res) => {
  const proyectosPromesa = Proyectos.findAll();
  const proyectoPromesa = Proyectos.findOne({
    where: {
      id: req.params.id,
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
  const proyectos = await Proyectos.findAll();
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
