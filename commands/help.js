const Discord = require("discord.js");
require('dotenv').config({ path: '../.env' })

module.exports.run = async (client, message, args) => {
  message.channel.send("!help - views this help");
  message.channel.send("!serverstats - activate/deactivate serverstats");
  message.channel.send("!info - shows info");
  message.channel.send("!invite - invite the bot");
};
