/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

const levelSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
	storage: `level.sqlite`,
	timestamps: false,
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
	username: {
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

messages.sync();

module.exports = {
	name: `crown`,
	modOnly: true,
	args: false,
	description: `Gives out the crown-role to the most active non-mod members of the server`,
	color: `#04AFEF`,
	async execute(client, message, args) {

		const role = message.guild.roles.cache.find(role => role.id === `783770770035048471`);

		message.guild.members.cache.forEach(member => {
			if (member.roles.cache.some(role => role.id === `783770770035048471`)) {
				member.roles.remove(role);
			}
		});

		var messagesCount;

		const result = await messages.findAndCountAll().then(result => {

			if (result.count <= 5) {
				messagesCount = result.count;
			} else {
				messagesCount = 5;
			}
		});

		messages.findAll({
			where: {
				mod: false
			},
			order: [
				[`messages`, `DESC`],
			]
		})
			.then(result => {
				var stringbuilder = ``;
				for (var i = 0; i < messagesCount; i++) {
					var member = message.guild.members.cache.find(member => member.id === result[i].dataValues.user_id);
					member.roles.add(role);
					stringbuilder = stringbuilder + `P${i+1}: <@${result[i].dataValues.user_id}> with ${result[i].dataValues.messages} messages send this month \n`;
				}

				var embed = new Discord.MessageEmbed()
					.setDescription(stringbuilder)
					.setColor(`#FFE338`)
					.setTimestamp()
					.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);

				message.channel.send(embed);
				messages.destroy({
					where: {},
					truncate: true
				});
			});
	},
};