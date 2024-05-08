const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../schemas/GuildSchema');

module.exports = {
  structure: {
    name: 'prefix',
    description: 'Obtén o establece el prefijo predeterminado',
    permissions: 'Administrator'
  },
  /**
   * @param {ExtendedClient} client 
   * @param {Message<true>} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {

    if (!config.handler?.mongodb?.enabled) {
      await message.reply({
        content: 'La base de datos no está lista. Este comando no se puede ejecutar.'
      });

      return;
    };

    const type = args[0];

    switch (type) {
      case 'set': {
        let data = await GuildSchema.findOne({ guild: message.guildId });

        if (!data) {
          data = new GuildSchema({
            guild: message.guildId
          });
        }

        const oldPrefix = data.prefix || config.handler.prefix;

        if (!args[1]) {
          await message.reply({
            content: 'Debes proporcionar el prefijo como segundo parámetro.'
          });

          return;
        }

        data.prefix = args[1];

        await data.save();

        await message.reply({
          content: `El antiguo prefijo \`${oldPrefix}\` se ha cambiado a \`${args[1]}\`.`
        });

        break;
      }

      case 'reset': {
        let data = await GuildSchema.findOne({ guild: message.guildId });

        if (data) {
          await GuildSchema.deleteOne({ guild: message.guildId });
        }

        await message.reply({
          content: `El nuevo prefijo en este servidor es: \`${config.handler.prefix}\` (predeterminado).`
        });

        break;
      }

      default: {
        await message.reply({
          content: 'Métodos permitidos: `set`, `reset`'
        });

        break;
      }
    }
  }
};
