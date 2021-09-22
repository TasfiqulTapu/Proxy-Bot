const fs = require("fs");
const {
  Client,
  Collection,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
console.log("hello world");
const token = process.env.TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const { prefix, relay, hide, logs, whitelist } = require("./config.json");
const { servers } = require("./whitelist.json");
const uptime = Date.now();
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content) return;
  if (!message.content.startsWith(prefix)) return;
  if (whitelist == true && !servers.includes(parseInt(message.guildId))) return;
  // if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");
  const commandName = args.shift().toLowerCase();
  // proxy command
  if (commandName == "p" || commandName == "proxy" || commandName == "hide") {
    try {
      let webhook;
      const webhooks = await message.channel.fetchWebhooks();
      webhook = webhooks.first();
      await webhooks.forEach(async hook => {
        if (webhook.owner.id == client.user.id) return;
        if (hook.owner.id == client.user.id) webhook = hook;
      });
      if (!webhook) webhook = await message.channel.createWebhook("Proxy", {});
      let name = message.author.username;
      let av = message.author.avatarURL();
      if (commandName == "hide" && hide == true) {
        name = "Someone";
        av = undefined;
      }
      let payload = message.content
        .split(" ")
        .slice(1)
        .join(" ");
      if (payload.length < 1) payload = "proxied";
      await webhook.send({
        content: payload,
        username: name,
        avatarURL: av,
        files: message.attachments
      });
      await message.delete();

      if (logs) {
        await client.channels.cache.get(logs).send({
          content: `${message.author.username} with id ${message.author.id} proxied in ${message.channel}`
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  // help command, totally useless
  else if (commandName == "help") {
    try {
      message.channel.send({ content: "go fuck yourself" });
    } catch (err) {
      console.log(err);
    }
  }
  //actual help command
  else if (commandName == "upupdowndownleftrightleftrightba") {
    try {
      message.channel.send({ content: `use ${prefix}proxy or ${prefix}p` });
    } catch (err) {
      console.log(err);
    }
  }
  // ping command, kinda helpful
  else if (commandName == "ping") {
    try {
      const embed = new MessageEmbed()
        .setColor("WHITE")
        .setTitle("**Ping Pong**🏓")
        .setDescription(
          `Latency is ${Date.now() -
            message.createdTimestamp}ms. API Latency is ${Math.round(
            client.ws.ping
          )}ms \nUptime:${Math.round((Date.now() - uptime) / 1000)} s`
        );
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
});

client.on("ready", () => {
  const activities = [
    //   ["", "PLAYING"],
    //   [" ", "LISTENING"],
    ["your browser history", "WATCHING"],
    ["for your memes", "WATCHING"],
    ["your mom", "PLAYING"]
  ];
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities.length - 1));
    client.user.setActivity(activities[index][0], {
      type: activities[index][1]
    });
  }, 30000);
});

client.login(process.env.TOKEN);
