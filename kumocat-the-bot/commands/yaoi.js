module.exports = {
    name: 'Yaoi',
    description: 'Radomize a yaoi reply',
    execute(message, args) {
        var yaoi = [
          'Yaaaoooii', 
          'STOP YAOI',
          'Are you into yaoi?',
          'Nono yaoi yaoi',
          'YURI > YAOI',
        ];

        let random =  Math.floor(Math.random() * yaoi.length);

        return message.channel.send(yaoi[random]);
    },
};