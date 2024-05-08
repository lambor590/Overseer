const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: {
    name: 'ping',
    description: 'Comprueba mi tiempo de latencia',
    aliases: ['p'],
    permissions: 'Administrator',
    cooldown: 5000
  },
  /**
   * @param {ExtendedClient} client 
   * @param {Message<true>} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {

    await message.reply({
      content: 'Mi latencia con discord es de ' + client.ws.ping + 'ms'
    });

  }
};
