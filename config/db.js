const { Sequelize } = require('sequelize');
// Extraer valores de env
require('dotenv').config({ path: 'variables.env' });

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize('uptasknode', 'ffespechennodejs', 'ixefo515DB4FREE', {
  host: 'db4free.net',
  port: 3306,
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

module.exports = db;
