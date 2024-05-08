const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../schemas/GuildSchema');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('help')
    .setDescription('¡Mira todos los comandos posibles!'),
  options: {
    cooldown: 15000
  },
  /**
   * @param {ExtendedClient} client 
   * @param {ChatInputCommandInteraction} interaction 
   */
  run: async (client, interaction) => {

    await interaction.deferReply();

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.enabled) {
      try {
        const data = (await GuildSchema.findOne({ guild: message.guildId }));

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      };
    };

    const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(Sin descripción)'}`);
    const mapPreCmds = client.collection.prefixcommands.map((v) => `\`${prefix}${v.structure.name}\` (${v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(', ') : 'Ninguno'}): ${v.structure.description || '(Sin descripción)'}`);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle('Ayuda')
          .addFields(
            { name: 'Comandos de barra diagonal', value: `${mapIntCmds.join('\n')}` },
            { name: 'Comandos de prefijo', value: `${mapPreCmds.join('\n')}` }
          )
      ]
    });

  }
};
