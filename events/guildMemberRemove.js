/* eslint-disable no-undef */
const Discord = require(`discord.js`);
const Canvas = require(`canvas`);

module.exports = async (client, member) => {

	const canvas = Canvas.createCanvas(700, 300);
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

	ctx.font = applyText(canvas, `${member.user.tag}!`);
	ctx.fillStyle = `red`;
	ctx.fillText(`Member left`, canvas.width / 4, canvas.height / 5);
	ctx.fillStyle = `white`;
	ctx.fillText(`${member.user.tag}!`, canvas.width / 3, canvas.height / 2);

	ctx.font = `25px Arial`;
	ctx.fillText(`Joined at:`, 250, 195);
	ctx.fillText(`Account created at:`, 250, 245);

	ctx.font = `18px Arial`;
	ctx.fillText(`${member.joinedAt}`, 250, 215);
	ctx.fillText(`${member.user.createdAt.toUTCString()}`, 250, 265);

	ctx.beginPath();
	ctx.arc(100, 175, 70, 0, 2 * Math.PI, true);
	ctx.strokeStyle = `white`;
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
		format: `jpg`
	}));
	ctx.drawImage(avatar, 0, 75, 200, 200);

	const finalImage = new Discord.MessageAttachment(canvas.toBuffer(), `memberLeft.png`);

	return client.channels.cache.get(process.env.SERVER_LOG_CHANNEL).send(finalImage);
};