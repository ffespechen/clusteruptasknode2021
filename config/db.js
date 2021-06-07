const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize('uptasknode', 'superuser', 'psswrd', {
  host: 'localhost',
  port: '3306',
  dialect: 'mariadb',
  define: {
    timestamps: false,
  },
});

module.exports = db;
