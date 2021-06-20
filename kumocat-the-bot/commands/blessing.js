module.exports = {
	name: 'Blessing',
	description: 'Handler for all blessings',
	execute(message, args) {
        const jones = "nDTgymir";
        const omalley = "a6txXPsM";
        
		return message.channel.send(`Jones: ${jones}\nO'malley: ${omalley}`);
    },
};