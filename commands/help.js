const Discord = require("discord.js");
require('dotenv').config({ path: '../.env' })

module.exports.run = async (client, message, args) => {
  message.channel.send(process.env.LANGUAGE_HELP_COMMAND);
};
