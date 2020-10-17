/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
module.exports = {
	name: `invite`,
	description: `Sends an invite to the Discord-server`,
	args: false,
	modOnly: false,
	color: `#8B9DFF`,
	execute(client, message, args) {
		message.channel.send(`https://discord.gg/invite/KTFBR8A`);
	},
};