/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

const comicsSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
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
	name: `comic`,
	description: `Send info about the current Hot-Lap-Challenge!`,
	async execute(client, message, args) {

		var date = new Date();

		const comicEmbed = new Discord.MessageEmbed()
			.setColor(`#04962b`)
			.setTitle(`**Comic**`)
			.addFields(
				{ name: `Username`, value: message.member.user.tag},
				{ name: `Command`, value: message.content},
				{ name: `Date`, value: date}
			)
			.setThumbnail(message.member.user.displayAvatarURL({ format: `jpg` }))
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
		channel.send(comicEmbed);
        
		try {
			const match = await comics.findOne({ order: Sequelize.literal(`random()`) });
			if(match) {
				let comicEmbed = new Discord.MessageEmbed()
					.setTitle(`comic`)
					.setDescription(match.instagram)
					.setImage(match.image)
					.setTimestamp()
					.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
				return message.channel.send(comicEmbed);
			}
			else {
				return message.channel.send(`error`);
			}
		} catch (e) {
			message.channel.send(`error: ` + e);
		}
	}  
};