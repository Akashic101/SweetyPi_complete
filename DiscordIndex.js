require('dotenv').config();
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

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({
    activity: {
        name: '!commands | !help' },
        status: 'idle',
        url: 'https://www.github/Akashic101/SweetyPi'})
    .catch(console.error);

});

client.on('ready', () =>{

  client.user.setPresence({
      activity: {
          name: '!help | !commands' },
          status: 'idle',
          url: 'https://www.github/Akashic101/SweetyPi'})
      .catch(console.error);

    client.channels.cache.get('641680374098952192').messages.fetch('712781048504647791').then(m => {
      console.log("Cached reaction message.");
  }).catch(e => {
  console.error("Error loading message.");
  console.error(e);
  });

  var date = new Date();

  const onlineEmbed = new Discord.MessageEmbed()
  .setColor('#b1d322')
  .setTitle('Online')
  .setURL('https://github.com/Akashic101/SweetyPi')
  .addFields(
      { name: 'date', value: date},
      { name: 'version', value: pjson.version}
  )
  .setTimestamp()
.setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(onlineEmbed);

});

//Gets called whenever a user joins the server
client.on('guildMemberAdd', (member) => {

  var date = new Date();

  const memberJoinedEmbed = new Discord.MessageEmbed()
  .setColor('#cf8d1c')
  .setTitle('Member joined')
  .addFields(
      { name: 'Username', value: member.user.tag},
      { name: 'Joined at', value: date},
      { name: 'Account created at', value: member.user.createdAt}
  )
  .setThumbnail(member.user.displayAvatarURL({ format: 'jpg' }))
  .setTimestamp()
.setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(memberJoinedEmbed);
});

//Gets called whenever a user leaves the server
client.on('guildMemberRemove',(member) => {

  var date = new Date();

  const memberLeftEmbed = new Discord.MessageEmbed()
  .setColor('#f14e43')
  .setTitle('Member left')
  .addFields(
      { name: 'Username', value: member.user.tag},
      { name: 'Left at', value: date}
  )
  .setThumbnail(member.user.displayAvatarURL({ format: 'jpg' }))
  .setTimestamp()
.setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(memberLeftEmbed);
});

client.on("messageReactionAdd", async (reaction, user) =>  {


  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  let reportEmbed = new Discord.MessageEmbed()
    .setTitle('**Report**')
    .setColor('#CC0000')
    .setTimestamp()
    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');

  switch(reaction.emoji.name) {
    case '1️⃣' :
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '2️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '3️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '4️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '5️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '6️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '7️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '8️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '9️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);

    case '0️⃣':
      reportEmbed.addFields(
        {name: 'User', value: reaction.message.author, inline: true},
        {name: 'Rule', value: reaction.emoji.name, inline: true},
        {name: 'Message', value: reaction.message.content, inline: true},
        {name: 'Link', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true}
      )
      return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(reportEmbed);
  }


  var d = new Date();
  if(reaction.message.id === '712781048504647791') {
      reaction.message.guild.members.fetch(user)
      .then((member) => {
          member.roles.add('712001337440862269').catch(console.error)
          .then(() => {
              let readyEmbed = new Discord.MessageEmbed()
              .setTitle('**Member agreed to rules**')
              .setDescription(`**${member.user.tag}** agreed to the rules at ` + d + ". He is in the server since " + Math.round((d - member.joinedAt) / 1000) + " seconds")
              .setColor("7F0000")
              .setTimestamp()
              .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
              client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(readyEmbed);
              }
          );
      });
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

	const { executor, target } = deletionLog;

  const messageDeletedEmbed = new Discord.MessageEmbed()
  .setTitle('**Deleted message**')
  .setColor("#c3032b")
  .setTimestamp()
  .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');

	if (target.id === message.author.id) {
    messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted by **${executor.tag}**.`)
    messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({ format: 'jpg' }))
	}	else {
    messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted, but I don't know by who`);
    messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({ format: 'jpg' }))
  }
  client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(messageDeletedEmbed);
});


client.on('message', async message => {

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if (!message.content.startsWith(prefix) || message.author.bot || message.author.self || !client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
  }
})