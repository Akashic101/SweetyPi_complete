var giphy = require('giphy-api')('T5KorUWr20CWveaTDfF2lFqcZKbHWcZ8');
const Discord = require('discord.js');

module.exports = {
	name: 'giphy',
	description: 'Lets the user search the giphy-database',
	async execute(message, args) {
        if (args[0] >= 10) {
            return message.channel.send("I'm sorry, it seems like you entered the command wrong. Please check if you entered it correcty or use !commands to see how your command should look like. If you believe there is an error, please contact <@320574128568401920>") 
        } 
        else if(!isNaN(args[0])) {
            var searchWord = ""
            for (var i = 1; i < args.length; i++) {
                searchWord = searchWord + args[i] + " "
            }
            giphy.search({
                q: searchWord,
                rating: 'g'
            }, function (err, res) {
                for(var i= 0; i < args[0]; i++) {
                    message.channel.send(res.data[i].embed_url)
                }
            });
        }
        else {
            var searchWord = ""
            for (var i = 0; i < args.length; i++) {
                searchWord = searchWord + args[i] + " "
            }
            giphy.search({
                q: searchWord,
                rating: 'g'
            }, function (err, res) {
                message.channel.send(res.data[0].embed_url)
            });
        }
	}
};