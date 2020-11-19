/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);

const comicsSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `comics.sqlite`,
});

const comics = comicsSeq.define(`comics`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	image: {
		type: Sequelize.STRING,
		unique: true,
	},
	instagram: {
		type: Sequelize.STRING,
		unique: true,
	},
});

module.exports = {
	name: `delComic`,
	modOnly: true,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `bot-commands`],
	description: `Deletes a comic from the comic-database`,
	color: `#f1c469`,
	async execute(client, message, args) {

		try {
			for (var i = 0; i < args.length; i++) {
				const rowCount = await comics.destroy({
					where: {
						image: args[i]
					}
				});

				if (!rowCount) {
					message.channel.send(`That comic did not exist.`);
				} else {
					message.channel.send(`Comic ` + args[i] + ` deleted.`);
				}
			}
		} catch (e) {
			console.log(e);
		}
	},
};