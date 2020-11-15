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
	name: `delsweety`,
	description: `Deletes an image of Sweety from the database`,
	async execute(client, message, args) {

		try {
			for(var i = 0; i < args.length; i++) {
				// equivalent to: DELETE from tags WHERE name = ?;
				const rowCount = await SweetyImages.destroy({ where: { link: args[i] } });
    
				if (!rowCount) {
					message.channel.send(`That link did not exist.`);
				}
				else {
					message.channel.send(`Link ` + args[i] + ` deleted.`);
				}
			}
		} catch (e) {
			console.log(e);
		}
	},
};