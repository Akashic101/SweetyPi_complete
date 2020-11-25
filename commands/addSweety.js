/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);

const sweetyImagesSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `sweetyImages.sqlite`,
});

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
	name: `addSweety`,
	modOnly: true,
	args: true,
	args_length: 1,
	description: `Adds a image/video to the sweety-database`,
	color: `#162fb8`,
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