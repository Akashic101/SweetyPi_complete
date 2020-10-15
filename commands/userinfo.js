/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var pjson = require(`../package.json`);
const Discord = require(`discord.js`);
const Canvas = require(`canvas`);

module.exports = {
	name: `userinfo`,
	description: `Sends info about a specific user`,
	args: true,
	args_length: 1,
	channel: [`test-channel`, `📱commands`],
	modOnly: false,
	color: `#3c4b75`,
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
	
		const background = await Canvas.loadImage(`image\\background.png`);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	
		ctx.font = applyText(canvas, `${message.member.user.tag}!`);
		ctx.fillStyle = `white`;
		ctx.fillText(`${message.member.user.tag}!`, canvas.width / 3, canvas.height /3.5);

		ctx.font = `20px Arial`;
		ctx.fillText(`Joined at:`, 250, 95);
		ctx.fillText(`Account created at:`, 250, 145);

		ctx.font = `15px Arial`;
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

		const finalImage = new Discord.MessageAttachment(canvas.toBuffer(), `userinfo.png`);

		return message.channel.send(finalImage);

		
	},
};