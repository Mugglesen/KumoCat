module.exports = {
	name: 'Blessing',
	description: 'Handler for all blessings',
	execute(message, args) {
        const jones = "0N3OeVPo";
        const omalley = "kF3S8zKE";
        
		return message.channel.send(`Jones: ${jones}\nO'malley: ${omalley}`);
    },
};