module.exports = {
	name: 'Spit',
	description: 'Radomize a spit reply',
	execute(message, args) {
        const spit = [
        'Spit in my mouth!', 
        'I got the moonaniiii',
        "I'll spit in your mouth!",
        'Jerry spits in my mouth',
        '...Can you feed me now?',
        ];

        let random =  Math.floor(Math.random() * spit.length);

    return message.channel.send(spit[random]);
	},
};