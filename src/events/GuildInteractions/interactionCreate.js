const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");

const cooldown = new Map();

module.exports = {
  event: "interactionCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;

    if (
      config.handler.commands.slash === false &&
      interaction.isChatInputCommand()
    )
      return;
    if (
      config.handler.commands.user === false &&
      interaction.isUserContextMenuCommand()
    )
      return;
    if (
      config.handler.commands.message === false &&
      interaction.isMessageContextMenuCommand()
    )
      return;

    const command = client.collection.interactioncommands.get(
      interaction.commandName
    );

    if (!command) return;

    try {
      if (command.options?.ownerOnly) {
        if (interaction.user.id !== config.users.ownerId) {
          await interaction.reply({
            content:
              config.messageSettings.ownerMessage !== undefined &&
                config.messageSettings.ownerMessage !== null &&
                config.messageSettings.ownerMessage !== ""
                ? config.messageSettings.ownerMessage
                : "Solo el desarrollador del bot tiene permiso para usar este comando.",
            ephemeral: true
          });

          return;
        }
      }

      if (command.options?.developers) {
        if (
          config.users?.developers?.length > 0 &&
          !config.users?.developers?.includes(interaction.user.id)
        ) {
          await interaction.reply({
            content:
              config.messageSettings.developerMessage !== undefined &&
                config.messageSettings.developerMessage !== null &&
                config.messageSettings.developerMessage !== ""
                ? config.messageSettings.developerMessage
                : "No estás autorizado para usar este comando.",
            ephemeral: true,
          });

          return;
        } else if (config.users?.developers?.length <= 0) {
          await interaction.reply({
            content:
              config.messageSettings.missingDevIDsMessage !== undefined &&
                config.messageSettings.missingDevIDsMessage !== null &&
                config.messageSettings.missingDevIDsMessage !== ""
                ? config.messageSettings.missingDevIDsMessage
                : "Este es un comando exclusivo para desarrolladores, pero no se puede ejecutar debido a que faltan IDs de usuario en el archivo de configuración.",

            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content:
            config.messageSettings.nsfwMessage !== undefined &&
              config.messageSettings.nsfwMessage !== null &&
              config.messageSettings.nsfwMessage !== ""
              ? config.messageSettings.nsfwMessage
              : "Este canal no es un canal NSFW",

          ephemeral: true,
        });

        return;
      }

      if (command.options?.cooldown) {
        const isGlobalCooldown = command.options.globalCooldown;
        const cooldownKey = isGlobalCooldown ? 'global_' + command.structure.name : interaction.user.id;
        const cooldownFunction = () => {
          let data = cooldown.get(cooldownKey);

          data.push(interaction.commandName);

          cooldown.set(cooldownKey, data);

          setTimeout(() => {
            let data = cooldown.get(cooldownKey);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(cooldownKey);
            } else {
              cooldown.set(cooldownKey, data);
            }
          }, command.options.cooldown);
        };

        if (cooldown.has(cooldownKey)) {
          let data = cooldown.get(cooldownKey);

          if (data.some((v) => v === interaction.commandName)) {
            const cooldownMessage = (isGlobalCooldown
              ? config.messageSettings.globalCooldownMessage ?? "Espera un momento. Este comando está en un cooldown global ({cooldown}s)."
              : config.messageSettings.cooldownMessage ?? "Espera un momento. Estás yendo demasiado rápido para usar este comando ({cooldown}s).").replace(/{cooldown}/g, command.options.cooldown / 1000);

            await interaction.reply({
              content: cooldownMessage,
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(cooldownKey, [interaction.commandName]);
          cooldownFunction();
        }
      }

      command.run(client, interaction);
    } catch (error) {
      log(error, "err");
    }
  },
};