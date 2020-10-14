/* eslint-disable no-undef */
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);

module.exports = async (client, message) => {

	if(client.bot) return;

	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: `MESSAGE_DELETE`,
	});

	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	const {
		executor,
		target
	} = deletionLog;

	const messageDeletedEmbed = new Discord.MessageEmbed()
		.setTitle(`**Deleted message**`)
		.setColor(`#c3032b`)
		.setTimestamp()
		.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);

	if (target.id === message.author.id) {
		messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted by **${executor.tag}**.`);
		messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({
			format: `jpg`
		}));
	} else {
		messageDeletedEmbed.setDescription(`A message by **${message.author.tag}** was deleted, but I don't know by who`);
		messageDeletedEmbed.setThumbnail(message.author.displayAvatarURL({
			format: `jpg`
		}));
	}
	client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(messageDeletedEmbed);
};