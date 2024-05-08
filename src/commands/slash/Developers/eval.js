const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Ejecuta algo de código.")
    .addStringOption((option) =>
      option
        .setName("código")
        .setDescription("El código a ejecutar.")
        .setRequired(true)
    ),
  options: {
    ownerOnly: true
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const code = interaction.options.getString("código");

    try {
      let executedEvalValue = eval(code);

      if (typeof executedEvalValue !== 'string') executedEvalValue = require('util').inspect(executedEvalValue);

      executedEvalValue = `${executedEvalValue}` // Making sure it's string

      executedEvalValue = executedEvalValue.replace(new RegExp(client.token, 'gi'), '?');

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Código ejecutado")
            .setDescription(`El código se ejecutó sin errores.`)
            .setColor('Green')
        ],
        files: [
          new AttachmentBuilder(Buffer.from(`${executedEvalValue}`.replace(new RegExp(`${client.token}`, 'g'), '"[TOKEN DEL BOT OCULTO]"'), 'utf-8'), { name: 'output.javascript' })
        ]
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`Algo salió mal al ejecutar el código.`)
            .setColor('Red')
        ],
        files: [
          new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'output.txt' })
        ]
      });
    };

  },
};
