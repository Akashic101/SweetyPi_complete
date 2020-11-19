/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `poll`,
	modOnly: false,
	args: false,
	description: `Creates a poll`,
	color: `#5c1c82`,
	execute(client, message, args) {

		try {
			let pollEmbed = new Discord.MessageEmbed()
				.setTitle(`**New Poll**`)
				.setColor((Math.random()*0xFFFFFF<<0).toString(16))
				.setTimestamp()
				.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`)
				.setDescription(message.author.username + ` wants to know: ` + message.content.slice(6));
			message.channel.send(pollEmbed).then(
				message => message.react(`764149683646889995`)).then(
				(reaction => reaction.message.react(`764147392823820348`)));
		} catch (e) {
			console.log(e);
		}
	},
};