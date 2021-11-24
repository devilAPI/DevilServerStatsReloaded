const Discord = require("discord.js");
require('dotenv').config({ path: '../.env' })

module.exports.run = async (client, message, args) => {
  message.channel.send("Add the Bot to your Server!\nhttps://discord.com/oauth2/authorize?client_id=913155497220272188&scope=bot&permissions=8")
};
