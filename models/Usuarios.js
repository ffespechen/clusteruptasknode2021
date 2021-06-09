const Sequelize = require('sequelize');
const { ModuleFilenameHelpers } = require('webpack');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define(
  'usuarios',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Agrega un correo válido',
        },
        notEmpty: {
          msg: 'No puede estar vacío',
        },
      },
      unique: {
        args: true,
        msg: 'Usuario ya registrado',
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'No puede ir vacío',
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10)
        );
      },
    },
  }
);

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
