/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
const client = new Discord.Client();
var pjson = require(`../package.json`);

const socialMediaSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `socialMedia.sqlite`,
});

//Model that defines the structure of the Social-Media-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SocialMedia = socialMediaSeq.define(`socialmedia`, {
	platform: {
		type: Sequelize.STRING,
	},
	username: {
		type: Sequelize.STRING,
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
	name: `facebook`,
	description: `Send info about the current Hot-Lap-Challenge!`,
	async execute(client, message, args) {

		var date = new Date();

		const facebookEmbed = new Discord.MessageEmbed()
			.setColor(`#445b3b`)
			.setTitle(`**Facebook**`)
			.addFields(
				{ name: `Username`, value: message.member.user.tag},
				{ name: `Command`, value: message.content},
				{ name: `Date`, value: date},
				{ name: `User`, value: args[0]}
			)
			.setThumbnail(message.member.user.displayAvatarURL({ format: `jpg` }))
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
		channel.send(facebookEmbed);

		if (args.length != 1) {
			return message.channel.send(`https://www.facebook.com/Redfur13-2323949451264229/?ref=aymt_homepage_panel&eid=ARBQBOOYhk572IzVWcoV08jK4-y8bf8sSRWQ-KRxqrryne0yGezIFTfZzgmEUg78Xn3D0VU15YKeTW2A`); 
		}
		else {
			try {
				const match = await SocialMedia.findOne({where: {platform: `facebook`, username: args[0]}});
				if(match) {
					match.increment(`usage_count`);
					return message.channel.send(`You can find the ` + match.platform + ` of ` + match.username + ` here: ` + match.link);
				}
				else {
					return message.channel.send(`I could not find that profile on that platform`);
				}
			}
			catch (e) {
				message.channel.send(`Could not find tag`);
				return console.log(e);
			}
		}
	}
};