/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const fs = require(`fs`);
var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `info`,
	modOnly: false,
	args: false,
	description: `Sends info about the bot`,
	color: `#1cf595`,
	execute(client, message, args) {
		fs.readdir(`./commands`, (err, files) => {
			let infoEmbed = new Discord.MessageEmbed()
				.setTitle(`info`)
				.setURL(`https://github.com/Akashic101/SweetyPi`)
				.setColor(`RANDOM`)
				.addFields({
					name: `Creator`,
					value: `<@320574128568401920>`,
					inline: true
				}, {
					name: `Version`,
					value: pjson.version,
					inline: true
				}, {
					name: `Commands`,
					value: files.length,
					inline: true
				})

				.setTimestamp()
				.setFooter(`${process.env.BOT_NAME} V ${pjson.version}`, process.env.BOT_PFP);
			message.channel.send(infoEmbed);
		});
	},
};