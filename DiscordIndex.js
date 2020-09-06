require('dotenv').config();
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var pjson = require('./package.json');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const token = process.env.DISCORD_TOKEN;

const prefix = '!';

client.login(token)

const levelSeq = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'level.sqlite',
  timestamps: false,
});

//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const level = levelSeq.define('level', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    unique: true,
  },
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  xp: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
});

const xp = levelSeq.define('xp', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    unique: true,
  },
  level: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  minimum: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  maximum: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
});

client.on('ready', () => {

  level.sync()
  xp.sync()

  console.log('Ready!');
  client.user.setPresence({
      activity: {
        name: '!help | !commands'
      },
      status: 'idle',
      url: 'https://www.github/Akashic101/SweetyPi'
    })
    .catch(console.error);

  client.channels.cache.get('641680374098952192').messages.fetch('712781048504647791').then(m => {
    console.log("Cached reaction and pronoun message.");
  }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
  });

  var date = new Date();

  const onlineEmbed = new Discord.MessageEmbed()
    .setColor('#b1d322')
    .setTitle('Online')
    .setURL('https://github.com/Akashic101/SweetyPi')
    .addFields({
      name: 'date',
      value: date
    }, {
      name: 'version',
      value: pjson.version
    })
    .setTimestamp()
    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  //client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(onlineEmbed);

});

//Gets called whenever a user joins the server
client.on('guildMemberAdd', (member) => {

  var date = new Date();

  const memberJoinedEmbed = new Discord.MessageEmbed()
    .setColor('#cf8d1c')
    .setTitle('Member joined')
    .addFields({
      name: 'Username',
      value: member.user.tag
    }, {
      name: 'Joined at',
      value: date
    }, {
      name: 'Account created at',
      value: member.user.createdAt
    })
    .setThumbnail(member.user.displayAvatarURL({
      format: 'jpg'
    }))
    .setTimestamp()
    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(memberJoinedEmbed);
});

//Gets called whenever a user leaves the server
client.on('guildMemberRemove', (member) => {

  var date = new Date();

  const memberLeftEmbed = new Discord.MessageEmbed()
    .setColor('#f14e43')
    .setTitle('Member left')
    .addFields({
      name: 'Username',
      value: member.user.tag
    }, {
      name: 'Left at',
      value: date
    })
    .setThumbnail(member.user.displayAvatarURL({
      format: 'jpg'
    }))
    .setTimestamp()
    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(memberLeftEmbed);
});

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

  switch (reaction.message.id) {
    case '712781048504647791s':
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
      }
      break;
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

client.on('messageDelete', async message => {

  if (!message.guild) return;
  const fetchedLogs = await message.guild.fetchAuditLogs({
    limit: 1,
    type: 'MESSAGE_DELETE',
  });

  const deletionLog = fetchedLogs.entries.first();

  if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

  const {
    executor,
    target
  } = deletionLog;

  const messageDeletedEmbed = new Discord.MessageEmbed()
    .setTitle('**Deleted message**')
    .setColor("#c3032b")
    .setTimestamp()
    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');

  if (target.id === message.author.id) {
    messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted by **${executor.tag}**.`)
    messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({
      format: 'jpg'
    }))
  } else {
    messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted, but I don't know by who`);
    messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({
      format: 'jpg'
    }))
  }
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(messageDeletedEmbed);
});


client.on('message', async message => {

  var increment = 0

  switch (message.channel.id) {
    case '641661443984588821': //suggestions
      increment = 1
      break;
    case '641623885065879582': //vip-chat
      increment = 2
      break;
    case '735979384653217872': //rich-people-club
      increment = 3
      break;
    case '641674237811097629': //chitchat
      increment = 1
      break;
    case '717741113674563587': //memes
      increment = 1
      break;
    case '641678073497911327': //pets
      increment = 1 + (message.attachments.size * 5)
      break;
    case '662287174691192832': //good-vibes
      increment = 1
      break;
    case '662287308032311307': //bad-vibes
      increment = 1
      break;
    case '641677806413283328': //gaming
      increment = 1 + (message.attachments.size * 3)
      break;
    case '685404830575231040': //sweety
      increment = 1
      break;
    case '710411736381128715': //stream-highlights
      increment = 0 + (message.embeds.length * 5)
      break;
    case '641674197814476830': //share-your-work
      increment = 1 + (message.attachments.size * 5)
      break;
    case '669958317711425556': //critique-your-work
      increment = 1
      break;
    case '679246697091825675': //promote-your-work
      increment = 2 + (message.embeds.length * 2)
      break;
    case '685192557226885155': //test-channel
      increment = 2
      break;
  }

  if (message.author.bot || message.author.self) return;

  try {
    const match = await level.findOne({
      where: {
        user_id: message.author.id
      }
    });
    if (match) {
      match.increment('xp', {
        by: increment
      });
      console.log(`${message.guild.members.cache.get(match.user_id).displayName} now has ${match.xp} xp`)
    } else {
      const match = await level.create({
        user_id: message.author.id,
        xp: 0,
        level: 0
      });
      let firstMessageEmbed = new Discord.MessageEmbed()
        .setTitle('**First Message**')
        .setDescription(`**${message.guild.members.cache.get(match.user_id)}** send their first message`)
        .setColor("#45959f")
        .addFields({
          name: 'Channel',
          value: message.channel.name,
          inline: true
        }, {
          name: 'Message',
          value: message.content,
          inline: true
        })
        .setTimestamp()
        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(firstMessageEmbed);
    }
  } catch (e) {
    return console.log(e);
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix) || message.author.bot || message.author.self || !client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
})