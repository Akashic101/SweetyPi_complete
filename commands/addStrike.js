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
	name: `addstrike`,
	description: `Adds a strike to a user`,
	async execute(client, message, args) {

		try {
			const match = await strikeList.create({
				user: args[0],
				strikeOne: args[1],
				strikeTwo: `-`,
				strikeThree: `-`
			});
			return message.channel.send(`The User ${match.user} has recieved his first strike.`);
		}
		catch (e) {
			if (e.name === `SequelizeUniqueConstraintError`) {				
				message.channel.send(`That User already exists`);
				return;
			}
			else {
				clientDIS.users.cache.get(`320574128568401920`).send(`error: ` + e);
				return;
			}
		}
		
	},
};