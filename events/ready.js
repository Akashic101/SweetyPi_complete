/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chalk = require(`chalk`);

module.exports = (client) => {
	client.user.setPresence({
		activity: {
			name: `!help | !commands`
		},
		status: `idle`,
		url: `https://www.github/Akashic101/SweetyPi`
	})
		.catch(console.error);

	client.channels.cache.get(`641680374098952192`).messages.fetch(`712781048504647791`).then(m => {
		console.log(chalk.bold.green(`Successfully cached messages`));
	}).catch(e => {
		console.error(chalk.red(`Error loading message`));
		console.error(e);
	});
};