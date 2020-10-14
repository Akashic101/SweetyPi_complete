/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `help`,
	description: `Send info about the current Hot-Lap-Challenge!`,
	execute(client, message, args) {

		var date = new Date();

		const helpLogEmbed = new Discord.MessageEmbed()
			.setColor(`#f21d31`)
			.setTitle(`**help**`)
			.addFields(
				{ name: `Username`, value: message.member.user.tag},
				{ name: `Command`, value: message.content},
				{ name: `Date`, value: date}
			)
			.setThumbnail(message.member.user.displayAvatarURL({ format: `jpg` }))
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
		channel.send(helpLogEmbed);

		let helpEmbed = new Discord.MessageEmbed()
			.setTitle(`Help`)
			.setURL(`https://github.com/Akashic101/SweetyPI#features`)
			.setColor((Math.random()*0xFFFFFF<<0).toString(16))
			.addFields(
				{ name: `Command`, value: `To get a list with all commands avalaible please use **!commands**`},
				{ name: `Rules`, value: `If you see something that breaks the rules please use the corresponding emote, for example :six: when someone breaks Rule 6`},
				{ name: `Questions`, value: `In case you have questions about rules or other topics regarding this server please don't hesitate to contact an Admin`},
				{ name: `SweetyPi`, value: `In case you have questions this bot, feel free to DM <@320574128568401920>`}
			)
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		return message.channel.send(helpEmbed);
	},
};