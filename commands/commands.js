/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `commands`,
	modOnly: false,
	args: false,
	description: `Sends every command the bot has`,
	color: `#56eeda`,
	execute(client, message, args) {

		let commandEmbed = new Discord.MessageEmbed()
			.setTitle(`Commands`)
			.setURL(`https://github.com/Akashic101/SweetyPi#commands`)
			.setColor((Math.random()*0xFFFFFF<<0).toString(16))
			.addFields(
				{ name: `!level`, value: `Informs you about your current level and xp`, inline: true},
				{ name: `!sweety`, value: `Sends you a random pic/video of Sweety`, inline: true},
				{ name: `!comic`, value: `Sends you a random comic`, inline: true},
				{ name: `\u200b`, value: `\u200b`},
				{ name: `!uptime`, value: `Displays how long SweetyPi is online`, inline: true},
				{ name: `!info`, value: `Shows general info`, inline: true},
				{ name: `!commands`, value: `Lists every command avalaible`, inline: true},
				{ name: `!help`, value: `Givey you a general idea where to find assistance`, inline: true},
				{ name: `!poll <text>`, value: `Creates a poll members can vote on using :thumbsup: or :thumbsdown: `, inline: true},
				{ name: `!corona <country>`, value: `Lists the current informations available about the specified country `, inline: true}
			)
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		message.channel.send(commandEmbed);
	},
};