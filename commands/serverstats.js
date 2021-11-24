const Discord = require("discord.js");
const db = require("quick.db");
const serverstats = new db.table("ServerStats");
require('dotenv').config({ path: '../.env' })

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(process.env.SETUP_NEEDED_PERMISSION))
    return message.channel.send(process.env.LANGUAGE_NO_PERMISSION);
  if (!args[0])
    return message.channel.send(process.env.LANGUAGE_INVALID_PARAMETERS);
  if (args[0] === "enable") {
    let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".totusers"
    });
    let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".membcount"
    });
    let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".botcount"
    });
    if (totusers !== null || membcount !== null || botcount !== null)
      return message.channel.send(process.env.LANGUAGE_ALREADY_ENABLED);
    if (!message.guild.me.permissions.has(`MANAGE_CHANNELS`))
      return message.channel.send(process.env.LANGUAGE_BOT_MISSING_PERMISSION);
    message.guild
      .channels.create(process.env.LANGUAGE_SERVER_STATS, {
        type: 'GUILD_CATEGORY', permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ["CONNECT"]
          }]
      })
      .then(channel => {
        channel.setPosition(0);
        message.guild
          .channels.create(process.env.LANGUAGE_TOTAL_USERS + message.guild.memberCount, {
            type: 'GUILD_VOICE', permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["CONNECT"]
              }]
          })
          .then(channel1 => {
            channel1.setParent(channel.id);
            let x = channel1.id;
            message.guild
              .channels.create(process.env.LANGUAGE_HUMAN_USERS + message.guild.members.cache.filter(member => !member.user.bot).size, {
                type: 'GUILD_VOICE', permissionOverwrites: [
                  {
                    id: message.guild.id,
                    deny: ["CONNECT"]
                  }]
              })
              .then(channel2 => {
                channel2.setParent(channel.id);
                let y = channel2.id;
                message.guild
                  .channels.create(process.env.LANGUAGE_BOT_USERS + message.guild.members.cache.filter(member => member.user.bot).size, {
                    type: 'GUILD_VOICE', permissionOverwrites: [
                      {
                        id: message.guild.id,
                        deny: ["CONNECT"]
                      }]
                  })
                  .then(async channel3 => {
                    channel3.setParent(channel.id);
                    let z = channel3.id;
                    await serverstats.set(`Stats_${message.guild.id}`, {
                      guildid: message.guild.id,
                      totusers: x,
                      membcount: y,
                      botcount: z,
                      categid: channel.id
                    });
                  });
              });
          });
      });
    message.channel.send(process.env.LANGUAGE_ENABLED_SERVERSTATS);
  } else if (args[0] === "disable") {
    let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".totusers"
    });
    let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".membcount"
    });
    let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".botcount"
    });
    let categ = await serverstats.fetch(`Stats_${message.guild.id}`, {
      target: ".categid"
    });
    if (totusers === null || membcount === null || botcount === null)
      return message.channel.send(process.env.LANGUAGE_DISABLED_SERVERSTATS_CURRENTLY);

    if (client.channels.cache.get(totusers) != undefined) {
      client.channels.cache.get(totusers).delete();
    }
    if (client.channels.cache.get(membcount) != undefined) {
      client.channels.cache.get(membcount).delete();
    }
    if (client.channels.cache.get(botcount) != undefined) {
      client.channels.cache.get(botcount).delete();
    }
    if (client.channels.cache.get(categ) != undefined) {
      client.channels.cache.get(categ).delete();
    }
    serverstats.delete(`Stats_${message.guild.id}`);
    message.channel.send(process.env.LANGUAGE_DISABLED_SERVERSTATS);
  }
};
