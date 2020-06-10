//CONFIG
var token = "NzIwMjM4NDk5MTk4MTQwa###NDU3.XuEs1g.aBGxVoPG1WqPZrlfhEGxLS-oM_4";
var totaltext = "Total Users : ";
var humantext = "Human Users : ";
var bottext = "Bot Users : ";

// DO NOT TOUCH
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");

client.on("ready", () => {
  const text = ` 

______________________________
Logged in as: ${client.user.tag}
Servers: ${client.guilds.size}
Users: ${client.users.size}
______________________________
`;
  console.log(text);
});
client.on("guildMemberAdd", async member => {
  const serverstats = new db.table("ServerStats");
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".guildid"
  });
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".totusers"
  });
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".membcount"
  });
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".botcount"
  });

  const totalsize = member.guild.memberCount;
  const botsize = member.guild.members.filter(m => m.user.bot).size;
  const humansize = totalsize - botsize;

  if (member.guild.id === sguildid) {
    member.guild.channels
      .get(tusers)
      .setName(totaltext + member.guild.memberCount);
    member.guild.channels.get(membs).setName(humantext + humansize);
    member.guild.channels
      .get(bots)
      .setName(bottext + member.guild.members.filter(m => m.user.bot).size);
  }
});
client.on("guildMemberRemove", async member => {
  const serverstats = new db.table("ServerStats");
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".guildid"
  });
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".totusers"
  });
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".membcount"
  });
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, {
    target: ".botcount"
  });

  const totalsize = member.guild.memberCount;
  const botsize = member.guild.members.filter(m => m.user.bot).size;
  const humansize = totalsize - botsize;

  if (member.guild.id === sguildid) {
    member.guild.channels
      .get(tusers)
      .setName(totaltext + member.guild.memberCount);
    member.guild.channels.get(membs).setName(humantext + humansize);
    member.guild.channels
      .get(bots)
      .setName(bottext + member.guild.members.filter(m => m.user.bot).size);
  }
});
client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = "!";

  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");
  let cmd = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix)) return;

  try {
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args);
  } catch (e) {
    console.log(e);
  }
});
client.login(token);