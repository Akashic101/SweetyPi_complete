/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);
const imgur = require(`imgur`);

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
	name: `addsweety`,
	modOnly: true,
	args: true,
	args_length: 1,
	description: `Adds images from an Imgur-Album to the Sweety-database`,
	color: `#162fb8`,
	async execute(client, message, args) {

		var album = args[0];

		console.log(args[0]);
		imgur.getAlbumInfo(album)
			.then(async function (json) {
				try {
					for (var i = 0; i < json.data.images_count; i++) {

						await SweetyImages.create({
							link: json.data.images[i].link
						});
					}
					message.channel.send(`All ${json.data.images_count} images and videos have been added`);
				} catch (e) {
					if (e.link === `SequelizeUniqueConstraintError`) {
						return message.channel.send(`That link already exists.`);
					}
					return message.channel.send(`Something went wrong with adding a link.`);
				}
			});
	},
};