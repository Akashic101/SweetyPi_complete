/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `roleinfo`,
	modOnly: true,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `bot-commands`],
	description: `Sends info about a role`,
	color: `#b887ab`,
	execute(client, message, args) {
		let role = message.mentions.roles.first();

		let roleInfoEmbed = new Discord.MessageEmbed()
			.setTitle(`Role Info`)
			.setColor(role.color.toString(16))
			.addFields({
				name: `Role name`,
				value: `<@&${role.id}>`,
				inline: true
			}, {
				name: `Role id`,
				value: role.id,
				inline: true
			}, {
				name: `Member count`,
				value: role.members.size,
				inline: true
			}, {
				name: `Mentionable`,
				value: changeFalseTrue(role.mentionable),
				inline: true
			}, {
				name: `Displayed separately`,
				value: changeFalseTrue(role.hoist),
				inline: true
			}, {
				name: `Displayed separately`,
				value: changeFalseTrue(role.hoist),
				inline: true
			}, {
				name: `Managed by other extension`,
				value: changeFalseTrue(role.managed),
				inline: true
			}, {
				name: `Color`,
				value: `#${role.color.toString(16)}`,
				inline: true
			})
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		message.channel.send(roleInfoEmbed);
	},
};

function changeFalseTrue(value) {
	if (value == true) {
		return `Yes`;
	} else {
		return `No`;
	}
}