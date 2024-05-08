const config = require('../../config');
const ExtendedClient = require('../../class/ExtendedClient');
const { EmbedBuilder } = require('discord.js');
const { time } = require('../../functions');

module.exports = {
  event: 'guildBanAdd',
  /**
   * 
   * @param {ExtendedClient} client 
   * @param {import('discord.js').GuildBan} ban 
   * @returns 
   */
  run: async (client, ban) => {

    if (!(config.channels.modLogs.enabled && config.channels.modLogs.channel)) return;

    const modLogsChannel = client.channels.cache.get(config.channels.modLogs.channel);

    if (!modLogsChannel || modLogsChannel.guildId !== ban.guild.id) return;

    try {
      const data = [
        `**Usuario**: ${ban.user.toString()}`,
        `**Razón**: ${ban.reason}`,
        `**Fecha**: ${time(Date.now(), 'D')} (${time(Date.now(), 'R')})`,
      ];

      await modLogsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Nuevo usuario baneado')
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(data.join('\n'))
            .setColor('Red')
        ]
      });
    } catch (err) {
      console.error(err);
    };

  }
};