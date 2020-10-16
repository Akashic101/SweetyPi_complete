/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

const sweetyImagesSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
	storage: `sweetyImages.sqlite`,
});

//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SweetyImages = sweetyImagesSeq.define(`sweetyImages`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
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
	name: `sweety`,
	description: `Sends a random image/video of Sweety`,
	async execute(client, message, args) {

		try {
			const match = await SweetyImages.findOne({ order: Sequelize.literal(`random()`) });
			if(match) {
				match.increment(`usage_count`);
				return message.channel.send(match.link);
			}
			else {
				return message.channel.send(`error`);
			}
		} catch (e) {
			return message.channel.send(`error: ` + e);
		}
	}
};