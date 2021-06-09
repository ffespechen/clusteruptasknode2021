const { Sequelize } = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

const Projectos = db.define(
  'proyectos',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: Sequelize.STRING(100),
    },

    url: {
      type: Sequelize.STRING(100),
    },
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();
        // Lógica de control

        proyecto.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

module.exports = Projectos;
