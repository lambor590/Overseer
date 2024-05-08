const config = require('../../config');
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder } = require('discord.js');
const { time, log } = require('../../functions');

module.exports = {
  event: 'messageUpdate',
  /**
   * 
   * @param {ExtendedClient} client 
   * @param {import('discord.js').Message} oldMessage 
   * @param {import('discord.js').Message} newMessage 
   * @returns 
   */
  run: async (client, oldMessage, newMessage) => {

    if (!(config.channels.modLogs.enabled && config.channels.modLogs.channel)) return;

    const modLogsChannel = client.channels.cache.get(config.channels.modLogs.channel);

    if (!modLogsChannel || modLogsChannel.guildId !== newMessage.guildId) return;

    if (oldMessage.author.bot || newMessage.author.bot) return;

    try {
      const data = [
        `**Anterior**: ${oldMessage.content}`,
        `**Nuevo**: ${newMessage.content}`,
        `**Autor**: ${newMessage.author.toString()}`,
        `**Fecha**: ${time(Date.now(), 'D')} (${time(Date.now(), 'R')})`,
      ];

      await modLogsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Mensaje editado')
            .setThumbnail(newMessage.author.displayAvatarURL())
            .setDescription(data.join('\n'))
            .setColor('Yellow')
        ]
      });
    } catch (err) {
      console.error(err);
    };

  }
};