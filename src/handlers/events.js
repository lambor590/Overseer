const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
  for (const dir of readdirSync('./src/events/')) {
    for (const file of readdirSync('./src/events/' + dir).filter((f) => f.endsWith('.js'))) {
      const module = require('../events/' + dir + '/' + file);

      if (!module) continue;

      if (!module.event || !module.run) {
        log('No se puede cargar el evento ' + file + ' debido a que faltan las propiedades \'nombre\' y/o \'ejecutar\'.', 'warn');

        continue;
      };

      log('Nuevo evento cargado: ' + file, 'info');

      if (module.once) {
        client.once(module.event, (...args) => module.run(client, ...args));
      } else {
        client.on(module.event, (...args) => module.run(client, ...args));
      };
    };
  };
};