const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("pfp")
    .setDescription("Cambia la imagen de perfil del bot.")
    .addAttachmentOption((option) =>
      option
        .setName("archivo")
        .setDescription("La imagen.")
        .setRequired(true)
    ),
  options: {
    developers: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const attachment = interaction.options.getAttachment('archivo', true);

    await client.user.setAvatar(attachment.proxyURL)
      .then(async () => {
        await interaction.editReply({
          content: 'Listo, foto de perfil actualizada.'
        });
      })
      .catch(async (err) => {
        await interaction.editReply({
          content: 'Algo salió mal:\n' + err
        });
      });
  },
};
