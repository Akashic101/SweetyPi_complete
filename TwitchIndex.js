/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
const tmi = require(`tmi.js`);
const Sequelize = require(`sequelize`);
require(`dotenv`).config();
var cron = require(`node-cron`);
const fs = require(`fs`);

const sweetyImagesSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
	storage: `sweetyImages.sqlite`,
});

//Model that defines the structure of the SweetyImages-database: More info: https://discordjs.guide/sequelize/#beta-creating-the-model
const SweetyImages = sweetyImagesSeq.define(`sweetyImages`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
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

const botOptions = {
	options: {
		debug: true,
	},
	connection: {
		cluster: `aws`,
		reconnect: true,
	},
	identity: {
		username: `SweetyTheRagdoll`,
		password: process.env.IDENTITY_PASSWORD,
	},
	channels: [`Redfur_13`],
};

const client = new tmi.client(botOptions);

client.connect();

//listens to incoming chat-messages
client.on(`chat`, async (channel, user, message, self) => {

	if (self || !message.startsWith(`!`)) return;

	const commandmessage = message.slice(1).trim().toLowerCase();

	switch (commandmessage) {
	case `pun`:
		fs.readFile(`./json/pun.json`, `utf8`, function (err, data) {
			if (err) {
				return console.log(err);
			}

			data++;
			client.say(channel, `There has been ${data} puns so far`);

			fs.writeFile(`./json/pun.json`, data, function (err) {
				if (err) return console.log(err);
			});
		});
		break;
	case `roulette`:
		var random_number = Math.round(Math.random() * 6 + 1);
		if (random_number == 1) {
			if (user.username == `rarin`) {
				client.say(channel, `${user.username} got bullied by the bot because he deserves it`);
				client.timeout(channel, user.username, 60, `BAMM You are dead`);
			} else {
				client.say(channel, `${user.username} died. F`);
				client.timeout(channel, user.username, 60, `BAMM You are dead`);
			}
		} else {
			client.say(channel, `Congratz ${user.username} on surviving. Wanna push your luck and try again?`);
		}
		break;
	case `social`:
		client.say(channel, `Instagram: https://www.instagram.com/sweetycomics, Discord: https://discordapp.com/invite/KTFBR8A, Webtoons: https://www.webtoons.com/en/challenge/sweety-comics/list?title_no=389966`);
		break;
	case `instagram`:
		client.say(channel, `https://www.instagram.com/sweetycomics`);
		break;
	case `discord`:
		client.say(channel, `https://discordapp.com/invite/KTFBR8A`);
		break;
	case `tapas`:
		client.say(channel, `https://tapas.io/series/Sweety-Comics`);
		break;
	case `music`:
		client.say(channel, `Join #Stream Music to listen to some awesome tunes redfur4Love https://discordapp.com/invite/KTFBR8A`);
		break;
	case `facebook`:
		client.say(channel, `https://www.facebook.com/Redfur13-2323949451264229/?ref=aymt_homepage_panel&eid=ARBQBOOYhk572IzVWcoV08jK4-y8bf8sSRWQ-KRxqrryne0yGezIFTfZzgmEUg78Xn3D0VU15YKeTW2A`);
		break;
	case `youtube`:
		client.say(channel, `https://www.youtube.com/channel/UCEefUPort7KP98FpTQGv91A`);
		break;
	case `twitter`:
		client.say(channel, `https://twitter.com/redfur13`);
		break;
	case `webtoon`:
		client.say(channel, `https://www.webtoons.com/en/challenge/sweety-comics/list?title_no=389966`);
		break;
	case `fiverr`:
		client.say(channel, `https://www.fiverr.com/share/9dNkgd`);
		break;
	case `uptime`:
		client.say(channel, `The hell do I know, I'm a cat`);
		break;
	case `guest`:
		client.say(channel, `https://multitwitch.tv/redfur_13/doodleforfood/redpandamon`);
		break;
	case `quote`:
		var rawdata = fs.readFileSync(`./json/quotes.json`);
		var quote = JSON.parse(rawdata);
		var item = quote.quotes[Math.floor(Math.random() * quote.quotes.length)];
		client.say(channel, `${item} ~ Redfur13`);
		break;
	case `hyello`:
		var message = `Hyello, welcome to my stream`;
		var newMessage = ``;

		for (var i = 0; i < message.length; i++) {
			var random_number = Math.round(Math.random() * 10 + 1);
			if (random_number % 2 == 0) {
				newMessage += message.charAt(i).toUpperCase();
			} else {
				newMessage += message.charAt(i).toLowerCase();
			}
		}
		client.say(channel, `redfur4Hyello ${newMessage} redfur4Hyello`);
		break;
	case `hi`:
		client.say(chanel, `Hello ` + user.username + ` >^ω^<`);
		break;
	case `shake`:
		var successMessage = [
			`Shakes paw`,
			`Lifts paw`
		];

		var failureMessage = [
			`Stares into your soul`,
			`Does nothing`,
			`Meows`,
			`Headbutts`,
			`Demands a treat`,
			`Screams`,
			`Walks away`,
			`Ignores you`,
			`Stares`,
			`demands headscratches`
		];

		var randomNumber = Math.floor((Math.random() * 100) + 1);
		if (randomNumber >= 1 && randomNumber <= 20) {
			var randomMessage = Math.floor((Math.random() * 2) + 1);
			client.say(channel, `/me ${successMessage[randomMessage - 1]}`);
		} else {
			var randomNumber = Math.floor((Math.random() * failureMessage.length) + 1);
			client.say(channel, `/me ${failureMessage[randomNumber- 1]}`);
		}
		break;
	case `love`:
		client.say(channel, `redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love redfur4Love `);
		break;
	case `sweety`:
		try {
			const match = await SweetyImages.findOne({
				order: Sequelize.literal(`random()`)
			});
			if (match) {
				match.increment(`usage_count`);
				return client.say(channel, `` + match.link);
			} else {
				return client.say(channel, `something broke and I don't know what`);
			}
		} catch (e) {
			console.log(`error: ` + e);
		}
		break;
	case `comic`:
		try {
			const match = await comics.findOne({
				order: Sequelize.literal(`random()`)
			});
			if (match) {
				return client.say(channel, `` + match.instagram);
			} else {
				return client.say(channel, `something broke and I don't know what`);
			}
		} catch (e) {
			console.log(`error: ` + e);
		}
		break;
	case `thanks`:
		var messages = [
			`No problem`,
			`Glad to help`,
			`Just doing my job`,
			`What can I say except you're welcome`,
			`Meow Meow`
		];

		var message = messages[Math.floor(Math.random() * messages.length)];

		client.say(channel, message + ` ` + user.username);
		break;
	}
});

//reacts when someone cheered more then 100 bits
client.on(`cheer`, (channel, userstate, message) => {
	if (userstate.bits < 100) {
		return;
	} else {
		client.say(channel, `redfur4Love redfur4Love ` + userstate.username + ` has cheered ` + userstate.bits + ` beans redfur4Love redfur4Love`);
	}
});

//reacts when someone subscribed
client.on(`subscription`, (channel, username, method, message, userstate) => {
	client.say(channel, `redfur4Love redfur4Love ` + username + ` just subscribed! redfur4Love redfur4Love `);
});

//Username gifted a subscription to recipient in a channel.
client.on(`subgift`, (channel, username, streakMonths, recipient, methods, userstate) => {
	let senderCount = ~~userstate[`msg-param-sender-count`];
	client.say(channel, `redfur4Love redfur4Love ` + username + ` just gifted a subscription to ` + recipient + `. They gifted in total ` + senderCount + ` subscriptions redfur4Love redfur4Love `);
});

//reacts when someone gifted a mystery-subscription
client.on(`submysterygift`, (channel, username, numbOfSubs, methods, userstate) => {
	let senderCount = ~~userstate[`msg-param-sender-count`];
	client.say(channel, `redfur4Love redfur4Love ` + username + ` just gifted ` + numbOfSubs + ` mystery-subscriptions. They gifted in total ` + senderCount + ` subscriptions redfur4Love redfur4Love `);
});

client.on(`resub`, (channel, username, months, message, userstate, methods) => {
	let cumulativeMonths = ~~userstate[`msg-param-cumulative-months`];
	client.say(channel, `redfur4Love redfur4Love ` + username + ` just continued his subscription. They are now subscribed since ` + cumulativeMonths + ` months redfur4Love redfur4Love`);
});

cron.schedule(`0,30 0-23 * * *`, () => {

	var messages = [
		`If you're a sub or a patron, you get access to exclusive comics over on the discord server! https://discordapp.com/KTFBR8A`,
		`Made a clip you want to share? Post it in the #stream-highlights channel on our Discord server! redfur4NoTouch https://discordapp.com/KTFBR8A`,
		`Stream is a little quiet isn't it? Join the Discord server voice chat to have some music! https://discordapp.com/KTFBR8A`
	];
	var item = messages[Math.floor(Math.random() * messages.length)];

	client.say(`redfur_13`, item);
});