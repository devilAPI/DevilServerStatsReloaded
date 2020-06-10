const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  message.channel.send("!help - views this help");
  message.channel.send("!serverstats - activate/deactivate serverstats");
};
