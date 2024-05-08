const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
  for (const dir of readdirSync('./src/components/')) {
    for (const file of readdirSync('./src/components/' + dir).filter((f) => f.endsWith('.js'))) {
      const module = require('../components/' + dir + '/' + file);

      if (!module) continue;

      if (dir === 'buttons') {
        if (!module.customId || !module.run) {
          log('No se puede cargar el componente ' + file + ' debido a que faltan las propiedades \'structure#customId\' y/o \'run\'.', 'warn');

          continue;
        };

        client.collection.components.buttons.set(module.customId, module);
      } else if (dir === 'selects') {
        if (!module.customId || !module.run) {
          log('No se puede cargar el menú de selección ' + file + ' debido a que faltan las propiedades \'structure#customId\' o/y \'run\'.', 'warn');

          continue;
        };

        client.collection.components.selects.set(module.customId, module);
      } else if (dir === 'modals') {
        if (!module.customId || !module.run) {
          log('No se puede cargar el ' + file + ' modal debido a que faltan las propiedades \'structure#customId\' o/y \'run\'.', 'warn');

          continue;
        };

        client.collection.components.modals.set(module.customId, module);
      } else if (dir === 'autocomplete') {
        if (!module.commandName || !module.run) {
          log('No se puede cargar el componente de autocompletar' + file + 'debido a que faltan las propiedades \'commandName\' o \'run\'.', 'warn');
          continue;
        }

        client.collection.components.autocomplete.set(module.commandName, module);

        log('Nuevo componente de autocompletar cargado: ' + file, 'info');
      } else {
        log('Tipo de componente no válido: ' + file, 'warn');
      }
    }
  }
};
