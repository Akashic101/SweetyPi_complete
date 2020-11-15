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
	name: `addsweety`,
	description: `Adds an image of Sweety to the database`,
	async execute(client, message, args) {

		try {
			for(var i = 0; i < args.length; i++) {
				const add = await SweetyImages.create({
					link: args[i]
				});
				message.channel.send(`Link ${add.link} added.`);
			}
		} catch (e) {
			if (e.link === `SequelizeUniqueConstraintError`) {
				return message.channel.send(`That link already exists.`);
			}
			return message.channel.send(`Something went wrong with adding a link.`);
		}
		
	},
};