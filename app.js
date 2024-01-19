const Discord = require("discord.js");
const config = require("./config.json");
const child = require("child_process");
const { codeBlock } = require("@discordjs/builders");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = "!";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Set rich presence
  client.user.setActivity("LinuxxMD Terminal Monitor", { type: "PLAYING" });

  // Set status to idle
  client.user.setStatus("idle");
});

client.on("messageCreate", (message) => {
  if (message.author.bot || message.author.id !== config.author_id) return;

  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  } else if (command === "t") {
    child.exec(args.join(" "), (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      message.reply(codeBlock(stdout));
    });
  }
});

client.login(config.BOT_TOKEN);
