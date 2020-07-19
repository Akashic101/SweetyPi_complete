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

client.on("messageReactionAdd", (reaction, user) => {
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