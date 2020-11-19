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
	name: `getstrike`,
	modOnly: true,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `bot-commands`],
	description: `Gets the strike of a user`,
	color: `#7f1a39`,
	async execute(client, message, args) {

		const match = await strikeList.findOne({
			where: {
				user: args[0]
			}
		});
		if (match) {
			const strikeEmbed = new Discord.MessageEmbed()
				.setColor(`746991`)
				.setTitle(`Strike info`)
				.addFields({
					name: `Username`,
					value: match.user
				}, {
					name: `Strike 1`,
					value: match.strikeOne,
					inline: true
				}, {
					name: `Strike 2`,
					value: match.strikeTwo,
					inline: true
				}, {
					name: `Strike 3`,
					value: match.strikeThree,
					inline: true
				}, )
				.setTimestamp()
				.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
			return message.channel.send(strikeEmbed);

		}
	},
};