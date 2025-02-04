const knex = require('knex');
const knexfile = require('../knexfile');

// Crear la conexión a la base de datos
const db = knex(knexfile.development);

// Verificar la conexión
db.raw('SELECT 1')
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente');
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });

module.exports = { db };
