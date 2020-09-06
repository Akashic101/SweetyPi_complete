require('dotenv').config();
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var pjson = require('./package.json');
const requireAll = require('require-all');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const files = requireAll({
  dirname: `${__dirname}/events`,
  filter: /^(?!-)(.+)\.js$/
});

for (const name in files) {
  const event = files[name];
  client.on(name, event.bind(null, client));
  console.log(`Event loaded: ${name}`);
}

const token = process.env.DISCORD_TOKEN;

client.login(token)

client.on("messageReactionRemove", async (reaction, user) => {

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return console.log('Something went wrong when fetching the message: ', error);
    }
  }
  switch (reaction.message.id) {
    case '712781048504647791':
      if (reaction.emoji.name == '✅')
        reaction.message.guild.members.fetch(user)
        .then((member) => {
          member.roles.remove('712001337440862269').catch(console.error)
        })
      break;
    case '🧡':
      reaction.message.guild.members.fetch(user)
        .then((member) => {
          member.setNickname(`${member.user.username}`)
        })
      break;
    case '❤️':
      reaction.message.guild.members.fetch(user)
        .then((member) => {
          member.setNickname(`${member.user.username}`)
        })
      break;
    case '💙':
      reaction.message.guild.members.fetch(user)
        .then((member) => {
          member.setNickname(`${member.user.username}`)
        })
      break;
  }
})

client.on("messageReactionAdd", async (reaction, user) => {

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return console.log('Something went wrong when fetching the message: ', error);
    }
  }

  if (reaction.message.id == '712781048504647791') {
    switch (reaction.emoji.name) {
      case '🧡':
        reaction.message.guild.members.fetch(user)
          .then((member) => {
            member.setNickname(`(he/him) ${member.user.username}`)
          })
        break;
      case '❤️':
        reaction.message.guild.members.fetch(user)
          .then((member) => {
            member.setNickname(`(she/her) ${member.user.username}`)
          })
        break;
      case '💙':
        reaction.message.guild.members.fetch(user)
          .then((member) => {
            member.setNickname(`(they/them) ${member.user.username}`)
          })
        break;
      case '✅':
        reaction.message.guild.members.fetch(user)
          .then((member) => {
            member.roles.add('712001337440862269').catch(console.error)
              .then(() => {
                var d = new Date();
                let readyEmbed = new Discord.MessageEmbed()
                  .setTitle('**Member agreed to rules**')
                  .setDescription(`**${member.user.tag}** agreed to the rules at ` + d + ". He is in the server since " + Math.round((d - member.joinedAt) / 1000) + " seconds")
                  .setColor("7F0000")
                  .setTimestamp()
                  .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(readyEmbed);
              });
          });
        break;
    }
  }

  let reportEmbed = new Discord.MessageEmbed()
    .setTitle('**Report**')
    .setColor('#CC0000')
    .setTimestamp()
    .addFields({
      name: 'User',
      value: reaction.message.author,
      inline: true
    }, {
      name: 'Message',
      value: reaction.message.content,
      inline: true
    })
    .setFooter(`${process.env.BOT_NAME} V${pjson.version}`, process.env.BOT_PFP);

  switch (reaction.emoji.name) {
    case '1️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '2️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '3️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '4️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '5️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '6️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '7️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '8️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '9️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
    case '0️⃣':
      reportEmbed.addField('Rule', reaction.emoji.name, true)
      reportEmbed.addField('Link', `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, true)
      client.channels.cache.get(process.env.OFFICE).send(reportEmbed);
      break;
  }
});