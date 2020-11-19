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
	name: `delSweety`,
	modOnly: true,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `bot-commands`],
	description: `Deletes an image/video from the sweety-database`,
	color: `#357dc0`,
	async execute(client, message, args) {
		try {
			for (var i = 0; i < args.length; i++) {
				const rowCount = await SweetyImages.destroy({
					where: {
						link: args[i]
					}
				});
				if (!rowCount) {
					message.channel.send(`That link did not exist.`);
				} else {
					message.channel.send(`Link ` + args[i] + ` deleted.`);
				}
			}
		} catch (e) {
			console.log(e);
		}
	},
};