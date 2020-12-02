/* eslint-disable no-undef */

const Sequelize = require(`sequelize`);

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
	messages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
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

		messages.findAll({
			where: {
				mod: false
			},
			order: [
				[`messages`, `DESC`],
			],
			limit: 5
		})
			.then(result => {
				var stringbuilder = ``;
				for (var i = 0; i < 5; i++) {
					var member = message.guild.members.cache.find(member => member.id === result[i].dataValues.user_id);
					member.roles.add(role);
					stringbuilder = stringbuilder + `P${i+1}: <@${result[i].dataValues.user_id}> with ${result[i].dataValues.messages} messages send this month \n`;
				}
				message.channel.send(stringbuilder);
			});
	},
};