const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const db = require("quick.db");
require('dotenv').config()

function getInviteLink() {
  return "https://discord.com/oauth2/authorize?client_id=" + process.env.BOT_ID + "&scope=bot&permissions=" + process.env.BOT_PERMISSION_NEEDED;
}

client.on("ready", () => {
  console.log(`✅ ${client.user.tag} is online!`)
  console.log("🌐 Invite Bot with " + getInviteLink())
  console.log(`📝 DevilServerStatsReloaded is currently tracking ${client.guilds.cache.size} Servers with ${client.users.cache.size} Members.\n`)
  client.user.setActivity(process.env.BOT_ACTIVITY + ` | Powered by DevilServerStats`, {
    type: process.env.BOT_ACTIVITY_TYPE
  })
  console.log("✅ Bot initialization done!")
});

client.on('guildMemberAdd', async member => {

  const serverstats = new db.table('ServerStats');
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.guildid' })
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.totusers' })
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.membcount' })
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.botcount' })

  if (member.guild.id === sguildid) {
    member.guild.channels.cache.get(tusers).setName(process.env.LANGUAGE_TOTAL_USERS + member.guild.memberCount);
    member.guild.channels.cache.get(membs).setName(process.env.LANGUAGE_HUMAN_USERS + member.guild.members.cache.filter(member => !member.user.bot).size);
    member.guild.channels.cache.get(bots).setName(process.env.LANGUAGE_BOT_USERS + member.guild.members.cache.filter(member => member.user.bot).size);
  }
  if (process.env.DEBUG_LOG == true) { console.log("Member Added") }
});

client.on('guildMemberRemove', async member => {

  const serverstats = new db.table('ServerStats');
  let sguildid = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.guildid' })
  let tusers = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.totusers' })
  let membs = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.membcount' })
  let bots = await serverstats.fetch(`Stats_${member.guild.id}`, { target: '.botcount' })

  if (member.guild.id === sguildid) {
    member.guild.channels.cache.get(tusers).setName(process.env.LANGUAGE_TOTAL_USERS + member.guild.memberCount);
    member.guild.channels.cache.get(membs).setName(process.env.LANGUAGE_HUMAN_USERS + member.guild.members.cache.filter(member => !member.user.bot).size);
    member.guild.channels.cache.get(bots).setName(process.env.LANGUAGE_BOT_USERS + member.guild.members.cache.filter(member => member.user.bot).size);
  }
  if (process.env.DEBUG_LOG == true) { console.log("Member Removed") }
});


client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(" ");
  let cmd = args.shift().toLowerCase();
  if (!message.content.startsWith(process.env.PREFIX)) return;

  try {
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args);
  } catch (e) {
    if (process.env.DEBUG_LOG == true) {
      console.log(e);
    }
  }
});
client.login(process.env.TOKEN);
