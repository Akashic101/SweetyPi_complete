module.exports = {
	name: 'roll',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {
        if(args.length == 2) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * args[1]) + args[0]))
        }
        else if(args.length == 1) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + args[0]))
        }
        else if(args.length == 0) {
            message.channel.send('Your random number is: ' + Math.floor((Math.random() * 6) + 1))
        }
        else {
            message.channel.send('Something broke and I don\'t know what. Please try again')
        }
	},
};