/* eslint-disable no-undef */
const api = require(`novelcovid`);
const Discord = require(`discord.js`);
var pjson = require(`../package.json`);
var numeral = require(`numeral`);

api.settings({
	baseUrl: `https://api.caw.sh`
});

module.exports = {
	name: `corona`,
	description: `Delivers current information about corona-cases in someones country`,
	execute(client, message, args) {

		var date = new Date();

		const coronaEmbed = new Discord.MessageEmbed()
			.setColor(`#5f847b`)
			.setTitle(`**Corona**`)
			.addFields(
				{ name: `Username`, value: message.member.user.tag},
				{ name: `Command`, value: message.content},
				{ name: `Date`, value: date},
				{ name: `Country`, value: args[0]}
			)
			.setThumbnail(message.member.user.displayAvatarURL({ format: `jpg` }))
			.setTimestamp()
			.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
		const channel = message.client.channels.cache.get(process.env.SERVER_LOG_CHANNEL);
		channel.send(coronaEmbed);
        
		if(args.length != 1) {
			return message.channel.send(`Please specify which country you want to recieve informations about, i.e ".corona Germany"`);
		}

		api.countries({country:args[0]}).then(result => {

			const coronaEmbed = new Discord.MessageEmbed()
				.setColor(`#C13584`)
				.setTitle(`Corona-cases in ${args[0]}`)
				.setDescription(`Remember to always wear a mask when going outside, keep social distance to each other and follow the rules of your countries health-experts. Stay safe ❤️`)
				.setThumbnail(result.countryInfo.flag)
				.addFields(
					{ name: `Cases`, value:  numeral(result.cases).format(`0,0`), inline: true },
					{ name: `Deaths`, value: numeral(result.deaths).format(`0,0`), inline: true },
					{ name: `Recovered`, value: numeral(result.recovered).format(`0,0`), inline: true },
					{ name: `Todays Cases`, value: numeral(result.todayCases).format(`0,0`), inline: true },
					{ name: `Todays Deaths`, value: numeral(result.todayDeaths).format(`0,0`), inline: true },
					{ name: `Todays Recovered`, value: numeral(result.todayRecovered).format(`0,0`), inline: true },
					{ name: `\u200B`, value: `\u200B` },
					{ name: `Active per Million`, value: result.activePerOneMillion, inline: true },
					{ name: `Deaths per Million`, value: result.criticalPerOneMillion, inline: true },
					{ name: `Recovered per Million`, value: result.recoveredPerOneMillion, inline: true },
					{ name: `\u200B`, value: `\u200B` },
					{ name: `Cases per Person`, value: `1 in ${numeral(result.oneCasePerPeople).format(`0,0`)}`, inline: true },
					{ name: `Deaths per Person`, value: `1 in ${numeral(result.oneDeathPerPeople).format(`0,0`)}`, inline: true },
					{ name: `Tests per Person`, value: `1/${result.oneTestPerPeople}`, inline: true },
				)
				.setTimestamp()
				.setFooter(`SweetyPi V` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);
			message.channel.send(coronaEmbed);
		});
	},
};