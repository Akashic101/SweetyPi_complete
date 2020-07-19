function sToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs;
}

module.exports = {
	name: 'uptime',
	description: 'Send info about the current Hot-Lap-Challenge!',
	execute(message, args) {
        const sentences = [
            'Maybe she should take a break soon',
            'Crazy how time flies when you are having fun',
            'And she isn\'t even breaking a sweat',
            'She really needs a nap right now',
            'Let\'s cheer her on',
            'All of that and her fur is still flawless',
            'Red really needs to up her treat-payment'
            ]
    
            return message.channel.send('SweetyPi worked without a break since ' + sToTime(message.client.uptime)  + ' hours. ' + (sentences[Math.floor(Math.random() * sentences.length)]));
	},
};