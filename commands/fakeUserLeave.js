/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `fakeuserleave`,
	modOnly: true,
	args: false,
	channel: [`test-channel`, `bot-commands`],
	description: `Emits the guildMemberRemove-event`,
	color: `#c06eff`,
	execute(client, message, args) {
		message.client.emit(`guildMemberRemove`, message.member);
	},
};