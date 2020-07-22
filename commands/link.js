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
	name: 'link',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

		var date = new Date();

		const linkAddedEmbed = new Discord.MessageEmbed()
			.setTitle('**New Appoval requested**')
			.setDescription('User: ' + message.author.username + ' (' + message.author.id + ')\n' +
				'platform: ' + args[0] + '\n' +
				'Link: ' + args[1])
			.setColor("#ff0000")
			.setTimestamp()
			.setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
		(message => message.react('👍'))
		const logChannel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
		logChannel.send(linkAddedEmbed);

        if (args.length != 2) {
            return message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>")
        }
        else {
			try {
                message.author.send('Your link has been sent in for approval. Once approved it will be accessible with !' + args[0] + ' ' + message.author.username + '. If there is a problem one of the mods will message you privately');
                message.delete();
				let linkEmbed = new Discord.MessageEmbed()
                    .setTitle('**New Appoval requested**')
                    .addFields(
                        {name: 'User', value:  message.author.username, inline: true},
                        {name: 'ID', value:  message.author.id, inline: true},
                        {name: '\u200B', value: '\u200B' },
                        {name: 'platform', value:  args[0], inline: true},
                        {name: 'Link', value:  args[1], inline: true}
                    )
				    .setColor("ff0000")
				    .setTimestamp()
					.setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
				const approvalChannel = message.client.channels.cache.get(process.env.APPROVAL_CHANNEL);
				approvalChannel.send(linkEmbed).then
                (message => message.react('👍'))
                return
			} catch (e) {
                console.log('error: ' + e)
			}
        }
	},
};