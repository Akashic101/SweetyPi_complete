/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `invite`,
	modOnly: false,
	args: false,
	description: `Sends the invite to a user`,
	color: `#224169`,
	execute(client, message, args) {
		message.channel.send(`https://discord.gg/invite/KTFBR8A`);
	},
};