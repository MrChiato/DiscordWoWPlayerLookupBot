const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { addNewTable, checkIfUserExists, removeEntryByRio } = require('./dbconnections.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
module.exports = {
	client
};

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
		var message = interaction.message;
		var embed = message.embeds[0];
		var charName = embed.title;
		var cleanrio = embed.url;
		var realm = embed.fields.find(field => field.name === "Realm").value;
		var guild = embed.fields.find(field => field.name === "Guild").value;
		var reason = embed.description;
		var username = embed.fields.find(field => field.name === "Added by").value;
		var currentDate = embed.fields.find(field => field.name === "Added on").value;


	if (interaction.customId === 'addUser') {
		if(!interaction.replied){
			if (await checkIfUserExists(cleanrio)){
				interaction.reply(charName+" is already on the blacklist");
				return
			}
			await addNewTable(cleanrio, charName, realm, guild, reason, username, currentDate);
			await interaction.reply(charName+" has been added to the blacklist");
		}
	} else if (interaction.customId === 'removeUser') {
		if(!interaction.replied)
			await removeEntryByRio(cleanrio);
			await interaction.reply(charName+" has been removed from the blacklist");
	}
	message.edit({ components: [] });
  });


// Log in to Discord with your client's token
client.login(token);


