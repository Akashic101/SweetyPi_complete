/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

const strikeListSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `strikeList.sqlite`,
});

const strikeList = strikeListSeq.define(`strikeList`, {
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
	name: `updatestrike`,
	modOnly: true,
	args: true,
	args_length: 2,
	channel: [`test-channel`, `bot-commands`],
	description: `Updates the strike of a user`,
	color: `#af4025`,
	async execute(client, message, args) {
		try {            
			if( args[1] == 1) {
				const match = await strikeList.findOne({ where: { user: args[0] } });
				if(match) {
					const matchUpdate = await strikeList.update({ strikeOne: args[2] }, { where: { user: match.user } });
					if (matchUpdate > 0) {
						const updateStrikeEmbed = new Discord.MessageEmbed()
							.setColor(`#0099ff`)
							.setTitle(`UpdateStrike`)
							.setDescription(`Strike ${args[1]} of ${match.user} has been updated`)
							.addFields(
								{name: `Strike 1`, value: match.strikeOne, inline: true},
								{name: `Strike 2`, value: match.strikeTwo, inline: true},
								{name: `Strike 3`, value: match.strikeThree, inline: true}
							)
							.setTimestamp()
							.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
						return message.channel.send(updateStrikeEmbed);
					}
				}
			}
			else if( args[1] == 2) {
				const match = await strikeList.findOne({ where: { user: args[0] } });
				if(match) {
					const matchUpdate = await strikeList.update({ strikeTwo: args[2] }, { where: { user: match.user } });
					if (matchUpdate > 0) {
						const updateStrikeEmbed = new Discord.MessageEmbed()
							.setColor(`#0099ff`)
							.setTitle(`UpdateStrike`)
							.setDescription(`Strike ${args[1]} of ${match.user} has been updated`)
							.addFields(
								{name: `Strike 1`, value: match.strikeOne, inline: true},
								{name: `Strike 2`, value: match.strikeTwo, inline: true},
								{name: `Strike 3`, value: match.strikeThree, inline: true}
							)
							.setTimestamp()
							.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
						return message.channel.send(updateStrikeEmbed);
					}
				}
			}
			else if( args[1] == 3) {
				const match = await strikeList.findOne({ where: { user: args[0] } });
				if(match) {
					const matchUpdate = await strikeList.update({ strikeThree: args[2] }, { where: { user: match.user } });
					if (matchUpdate > 0) {
						const updateStrikeEmbed = new Discord.MessageEmbed()
							.setColor(`#0099ff`)
							.setTitle(`UpdateStrike`)
							.setDescription(`Strike ${args[1]} of ${match.user} has been updated`)
							.addFields(
								{name: `Strike 1`, value: match.strikeOne, inline: true},
								{name: `Strike 2`, value: match.strikeTwo, inline: true},
								{name: `Strike 3`, value: match.strikeThree, inline: true}
							)
							.setTimestamp()
							.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
						return message.channel.send(updateStrikeEmbed);
					}
				}
			}
		}
		catch (e) {
			return message.channel.send(`error: ` + e);
		}
	},
};