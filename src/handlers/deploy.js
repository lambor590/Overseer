const { REST, Routes } = require("discord.js");
const { log, isSnowflake } = require("../functions");
const config = require("../config");
const ExtendedClient = require("../class/ExtendedClient");

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN || config.client.token
  );

  try {
    log("Cargando comandos de aplicación...", "info");

    const guildId = process.env.GUILD_ID || config.development.guild;

    if (config.development && config.development.enabled && guildId) {
      if (!isSnowflake(guildId)) {
        log("Falta el ID del servidor. Ponlo en el archivo .env o en el archivo de configuración o deshabilita el modo desarrollo", "err");
        return;
      };

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID || config.client.id, guildId), {
        body: client.applicationcommandsArray,
      }
      );

      log(`Comandos de aplicación cargados con éxito en el servidor ${guildId}.`, "done");
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID || config.client.id), {
        body: client.applicationcommandsArray,
      }
      );

      log("Comandos de aplicación cargados globalmente con éxito en la API de Discord.", "done");
    }
  } catch (e) {
    log("No se pueden cargar los comandos de aplicación en la API de Discord: " + e.message, "err");
  }
};
