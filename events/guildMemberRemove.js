/* eslint-disable no-undef */
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

module.exports = (client, member) => {
	var date = new Date();

	const memberLeftEmbed = new Discord.MessageEmbed()
		.setColor(`#f14e43`)
		.setTitle(`Member left`)
		.addFields({
			name: `Username`,
			value: member.user.tag
		}, {
			name: `Left at`,
			value: date
		})
		.setThumbnail(member.user.displayAvatarURL({
			format: `jpg`
		}))
		.setTimestamp()
		.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
	client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(memberLeftEmbed);
};