/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `fakeuserjoin`,
	modOnly: true,
	args: false,
	channel: [`test-channel`, `bot-commands`],
	description: `Emits the guildMemberAdd-event`,
	color: `#148960`,
	execute(client, message, args) {
		message.client.emit(`guildMemberAdd`, message.member);
	},
};