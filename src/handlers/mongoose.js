const { connect } = require("mongoose");
const config = require("../config");
const { log } = require("../functions");

module.exports = async () => {
  log('Conectando con la base de datos...', 'info');

  await connect(process.env.MONGODB_URI || config.handler.mongodb.uri).then(() => {
    log('Conexión con la base de datos establecida', 'done')
  });
};