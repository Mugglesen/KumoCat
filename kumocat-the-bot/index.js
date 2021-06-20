const fs = require('fs');

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name.toLowerCase(), command);
}



client.packs = new Discord.Collection();
const tab = require(`../droptables/xpack.js`);
client.packs.set(tab.name, tab);

for(const drops of client.packs) {
    console.log(drops.dropTable);
}


client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`with Jerry`);

    console.log(client.commands);
    console.log(client.packs.dropTable);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  //ignore other bots
  if(message.author.bot) return;
  

  //Are we talking about kumocat?
  if(message.content.toLowerCase().indexOf(config.prefix) !== 0
     && message.content.toLowerCase().includes('kumocat')) {
      return message.channel.send(':eyes:');

  //Is user talking to kumocat (prefix)?
    } else if (message.content.toLowerCase().indexOf(config.prefix) !== 0) return;
  

  //Yes!
  const args = message.content.slice(config.prefix.length).trim().split(/ /g);
  const command = args.shift().toLowerCase();
  console.log("(command: " + command + " | args: " + args + ")");
 
  if (!client.commands.has(command)) { 
    if (command == "stop") { return message.channel.send('What did I do?'); }
    if (message.content.toLowerCase().includes('handsome')) { return message.channel.send('You are not very handsome...'); }
    return;
  }

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There may have been a problem executing that command, sir.');
  }


  
    

});

client.login(config.token);
