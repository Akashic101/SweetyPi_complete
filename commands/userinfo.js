/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Discord = require(`discord.js`);
const Canvas = require(`canvas`);
const fs = require(`fs`);
const Sequelize = require(`sequelize`);

const levelSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	// SQLite only
	storage: `level.sqlite`,
});

const level = levelSeq.define(`level`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	user_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	xp: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
});

const messages = levelSeq.define(`messages`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	user_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
	messages: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	mod: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

const levelTable = levelSeq.define(`levelTable`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	level: {
		type: Sequelize.INTEGER,
		unique: true,
	},
	xp_needed: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
});

messages.sync();
levelTable.sync();
level.sync();

module.exports = {
	name: `userinfo`,
	description: `Sends info about a specific user`,
	args: false,
	channel: [`test-channel`, `📱commands`],
	modOnly: false,
	color: `#ea6ecc`,
	async execute(client, message, args) {

		const canvas = Canvas.createCanvas(700, 200);
		const ctx = canvas.getContext(`2d`);

		const applyText = (canvas, text) => {
			const ctx = canvas.getContext(`2d`);

			let fontSize = 60;

			do {
				ctx.font = `${fontSize -= 10}px sans-serif`;
			} while (ctx.measureText(text).width > canvas.width - 300);

			return ctx.font;
		};

		const background = await Canvas.loadImage(`image/background.png`);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.font = applyText(canvas, `${message.member.user.tag}!`);
		ctx.fillStyle = `white`;
		ctx.fillText(`${message.member.user.tag}!`, canvas.width / 3, canvas.height / 3.5);

		ctx.font = `25px Arial`;
		ctx.fillText(`Joined at:`, 250, 95);
		ctx.fillText(`Account created at:`, 250, 145);

		ctx.font = `18px Arial`;
		ctx.fillText(`${new Date().toUTCString()}`, 250, 115);
		ctx.fillText(`${message.member.user.createdAt.toUTCString()}`, 250, 165);

		ctx.beginPath();
		ctx.arc(100, 100, 70, 0, 2 * Math.PI, true);
		ctx.strokeStyle = `white`;
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({
			format: `jpg`
		}));
		ctx.drawImage(avatar, 0, 0, 200, 200);

		const buffer = canvas.toBuffer(`image/png`);
		fs.writeFileSync(`./userinfo.png`, buffer);

		var userID = message.member.user.id;

		try {
			const match = await level.findOne({
				where: {
					user_id: userID
				}
			});

			if (match) {
				const userLevel = await levelTable.findAll({
					attributes: [`xp_needed`]
				});
				const userString = userLevel.map(t => t.xp_needed);
				var index = userString.findIndex(function (number) {
					return number > match.xp;
				});

				if (userLevel) {
					var levelMessage = `Level ${index} (${match.xp} XP)`;
				}
			}
		} catch (e) {
			console.log(e);
		}

		var roles = message.member.roles.cache.map(r => r.name).slice(0, -1);

		const attachment = new Discord
			.MessageAttachment(`./userinfo.png`, `userinfo.png`);
		const embed = new Discord.MessageEmbed()
			.setTitle(`User Info about ${message.member.user.tag}`)
			.attachFiles(attachment)
			.setDescription(`Roles: ${roles}`)
			.setImage(`attachment://userinfo.png`)
			.addField(`Level`, levelMessage, true);

		return message.channel.send(embed);
	},
};