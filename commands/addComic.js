/* eslint-disable no-unused-vars */
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
	name: `addComic`,
	modOnly: true,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `bot-commands`, `office`],
	description: `Adds a comic to the comic-database`,
	color: `#4fdef0`,
	async execute(client, message, args) {

		try {
			const add = await comics.create({
				image: args[0],
				instagram: args[1]
			});
			return message.channel.send(`Comic ${add.image} with link ${add.instagram} added.`);

		} catch (e) {
			if (e.image === `SequelizeUniqueConstraintError`) {
				return message.channel.send(`That comic already exists.`);
			}
			return message.channel.send(`Something went wrong with adding a link.`);
		}
	},
};