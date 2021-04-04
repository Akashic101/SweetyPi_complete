/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Sequelize = require(`sequelize`);

const levelSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
	storage: `level.sqlite`,
});

const messages = levelSeq.define(`messages`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	user_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	messages: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	mod: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

const channels = levelSeq.define(`channels`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	channel_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	channel_name: {
		type: Sequelize.STRING,
		unique: true,
	},
	messages: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
});

messages.sync();
channels.sync();

module.exports = {
	name: `server`,
	modOnly: true,
	args: false,
	description: `Sends info about the server`,
	color: `#a664fe`,
	async execute(client, message, args) {

		const today = new Date();
		var channelCount;

		const exampleEmbed = {
			title: `Server-breakdown for ${getMonth()} ${today.getFullYear()}`,
			color: `#FFE338`,
			timestamp: new Date(),
			footer: {
				text: `SweetyPi V` + pjson.version,
				icon_url: 'https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png',
			},
		};

		await channels.findAndCountAll().then(result => {
			channelCount = result.count;
		});

		channels.findAll({
			order: [
				[`messages`, `DESC`],
			]
		}).then(result => {
			var stringbuilder = `**Channel-Fnfo** \n`;
			for (var i = 0; i < channelCount; i++) {
				stringbuilder = stringbuilder + (`<#${result[i].dataValues.channel_id}>: ${result[i].dataValues.messages} messages send \n`);
			}
			exampleEmbed.description = stringbuilder;
		});

		var messagesCount;
		
		await messages.findAndCountAll().then(result => {
			messagesCount = result.count;
		});

		messages.findAll({
			order: [
				[`messages`, `DESC`],
			]
		}).then(result => {
			var stringbuilder = exampleEmbed.description + `\n **Member-Info** \n`;
			for (var i = 0; i < messagesCount; i++) {
				stringbuilder = stringbuilder + `P${i+1}: <@${result[i].dataValues.user_id}> with ${result[i].dataValues.messages} messages send this month \n`;
			}
			exampleEmbed.description = stringbuilder;
			message.channel.send({
				embed: exampleEmbed
			});
		});
	},
};

function getMonth() {
	const today = new Date();
	var month = new Array();
	month[0] = `January`;
	month[1] = `February`;
	month[2] = `March`;
	month[3] = `April`;
	month[4] = `May`;
	month[5] = `June`;
	month[6] = `July`;
	month[7] = `August`;
	month[8] = `September`;
	month[9] = `October`;
	month[10] = `November`;
	month[11] = `December`;

	return month[today.getMonth()];
}