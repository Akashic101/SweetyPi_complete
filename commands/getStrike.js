const Sequelize = require('sequelize');
const Discord = require('discord.js');
var pjson = require('../package.json');

const strikeListSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'strikeList.sqlite',
});

const strikeList = strikeListSeq.define('strikeList', {
	user: {
		type: Sequelize.STRING,
	},
	strikeOne: {
		type: Sequelize.STRING,
	},
	strikeTwo: {
		type: Sequelize.STRING,
	},
	strikeThree: {
		type: Sequelize.STRING,
	},
});

module.exports = {
	name: 'getstrike',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {

        const twitterEmbed = new Discord.MessageEmbed()
        .setColor('#157426')
        .setTitle(`**Get Strike**`)
        .addFields(
            { name: 'Username', value: message.member.user.tag},
            { name: 'Command', value: message.content},
			{ name: 'Date', value: date},
			{ name: 'User', value: args[0]}
        )
        .setThumbnail(message.member.user.displayAvatarURL({ format: 'jpg' }))
        .setTimestamp()
        .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
        const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
        channel.send(twitterEmbed);

        if (!message.member.roles.cache.has('641618875846492170')) {
            message.channel.send("I'm sorry, you do not have the permissions to do that. If you think this was a mistake please contact <@320574128568401920>")
            return
        }
        else if (args.length != 1) {
            message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>")
            return
        }
        else {
            const match = await strikeList.findOne({ where: { user: args[0] } });
            if (match) {
                const strikeEmbed = new Discord.MessageEmbed()
                    .setColor('746991')
                    .setTitle(`Strike info`)
                    .addFields(
                        { name: 'Username', value: match.user},
                        { name: 'Strike 1', value: match.strikeOne, inline: true},
                        { name: 'Strike 2', value: match.strikeTwo, inline: true},
                        { name: 'Strike 3', value: match.strikeThree, inline: true},
                    )
                    .setTimestamp()
                    .setFooter('SweetyPi V' + pjson.version, 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png');
                return message.channel.send(strikeEmbed);
            }
        }
	},
};