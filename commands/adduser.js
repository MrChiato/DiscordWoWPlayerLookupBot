const { SlashCommandBuilder } = require('discord.js');
const { CreateBlacklistEmbed } = require('../embedbuilder.js');
const { checkIfUserExists } = require('../dbconnections.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bladd')
		.setDescription('Adds a user to the blacklist')
		.addStringOption
		(option =>
			option
				.setName('rio')
				.setDescription('The Raider.io link you want to add to the blacklist')
				.setRequired(true)
			)
		.addStringOption
		(option => 
			option
				.setName('reason')
				.setDescription('Reason for adding this user to the blacklist')
				.setRequired(true)
			),
	async execute(interaction) {

		const target = interaction.options.getString('rio');
		const reason = interaction.options.getString('reason');
		var guild = "";
		const user = interaction.user;
		const username = interaction.user.username;
		const channel = interaction.channel;
		const currentDate = new Date().toISOString();
		const justDate = new Date().toISOString().slice(0, 10);

		var decodedurl = decodeURIComponent(target);
		var cleanrio = decodedurl.replace('?utm_source=addon', "");
		console.log("clean:", cleanrio);

		const regex = /\/characters\/(?:eu|us|kr|tw|cn)\/([\w-]+)\/([^/?]+)/;
		const matches = cleanrio.match(regex);

		if (matches) {
			var realm = matches[1];
			var character = matches[2];
		}

		if (await checkIfUserExists(cleanrio)){
			interaction.reply(character+" is already on the blacklist");
			return
		}

		interaction.reply("Getting user info..");

		const regionName = "eu";
		fetch(`https://raider.io/api/v1/characters/profile?region=${regionName}&realm=${realm}&name=${character}&fields=guild`)
		  .then(response => response.json())
		  .then(data => {
			if(data.guild)
				guild = data.guild.name ?? "";
			else
				guild = "Not in a guild";
			CreateBlacklistEmbed(cleanrio, character, realm, guild, reason, username, justDate, channel);
		  })
		  .catch(error => {
			console.error(error);
			guild = "";
			CreateBlacklistEmbed(cleanrio, character, realm, guild, reason, username, justDate, channel);
		  });

	},
};