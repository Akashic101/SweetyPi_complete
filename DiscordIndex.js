/*-------------------Requierements-------------------*/

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const pjson = require('./package.json');
const requireAll = require('require-all');
const chalk = require('chalk');

const prefix = "!";

/*-------------------Requierements-------------------*/

/*------------------Command Handler------------------*/

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/*------------------Command Handler------------------*/

/*-----------------------Login-----------------------*/

const token = process.env.DISCORD_TOKEN;

client.login(token)

/*-----------------------Login-----------------------*/

const cooldowns = new Discord.Collection();

client.once('ready', () => {
  client.user.setPresence({
      activity: {
        name: '!help | !commands'
      },
      status: 'idle',
      url: 'https://www.github/Akashic101/SweetyPi'
    })
    .catch(console.error);

  client.channels.cache.get('641680374098952192').messages.fetch('712781048504647791').then(m => {
    console.log(chalk.bold.green("Successfully cached messages"));
  }).catch(e => {
    console.error(chalk.red("Error loading message"));
    console.error(e);
  });
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(token);