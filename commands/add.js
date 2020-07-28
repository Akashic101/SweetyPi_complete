const Sequelize = require('sequelize');
const Discord = require('discord.js');
const client = new Discord.Client();
var pjson = require('../package.json');

const socialMediaSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'socialMedia.sqlite',
});

//Model that defines the structure of the Social-Media-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SocialMedia = socialMediaSeq.define('socialmedia', {
	platform: {
		type: Sequelize.STRING,
	},
	username: {
		type: Sequelize.STRING,
	},
	link: {
		type: Sequelize.STRING,
		unique: true,
	},
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	name: 'add',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(client, message, args) {

        var date = new Date();

        const addEmbed = new Discord.MessageEmbed()
        .setColor('#f6f219')
        .setTitle(`**User added**`)
        .addFields(
            { name: 'Username', value: message.member.user.tag},
            { name: 'Command', value: message.content},
            { name: 'Date', value: date},
            { name: 'platform', value: args[0], inline: true},
            { name: 'username', value: args[1], inline: true},
            { name: 'link', value: args[2], inline: true}
        )
        .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
        .setTimestamp()
        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(addEmbed);

        if (!message.member.roles.cache.has('641618875846492170')) {
            return message.channel.send("I'm sorry, you do not have the permissions to do that. If you think this was a mistake please contact <@320574128568401920>")
        }
        else if (args.length != 3) {
            return message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>") 
        }
        else {
			try {
                const match = await SocialMedia.create({
                    platform: args[0],
                    username: args[1],
                    link: args[2]
                });
                let addEmbed = new Discord.MessageEmbed()
                    .setTitle('**New Appoval requested**')
                    .addFields(
                        {name: 'User', value:  args[1], inline: true},
                        {name: 'platform', value:  args[0], inline: true},
                        {name: 'Link', value:  args[2], inline: true}
                    )
				    .setColor("ff0000")
				    .setTimestamp()
                    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                    return message.channel.send(addEmbed)
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {				
                    return message.channel.send('That link already exists'); 
                }
                else {
                    clientDIS.users.cache.get('320574128568401920').send('error: ' + e);
                }
            }
        }
	}
};