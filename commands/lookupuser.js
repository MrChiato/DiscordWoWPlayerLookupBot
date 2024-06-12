const { SlashCommandBuilder } = require('discord.js');
const { getBlacklistEntryByRio, getBlacklistEntriesByName, getBlacklistEntriesByRealm, getBlacklistEntriesByGuild } = require('../dbconnections.js');
const { CreateBlacklistEmbed } = require('../embedbuilder.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blsearch')
		.setDescription('Search the blacklist for a user')
		.addStringOption
		(option =>
			option
				.setName('rio')
				.setDescription('Search for rio link')
				.setRequired(false)
			)
		.addStringOption
		(option => 
			option
				.setName('name')
				.setDescription('Search for character name')
				.setRequired(false)
			)
		.addStringOption
		(option => 
			option
				.setName('realm')
				.setDescription('Find all users from specific realm')
				.setRequired(false)
			)		
		.addStringOption
		(option => 
			option
				.setName('guild')
				.setDescription('Find all users from guild')
				.setRequired(false)
			),
	async execute(interaction) {
		const rio = interaction.options.getString('rio');
		const name = interaction.options.getString('name');
		const realm = interaction.options.getString('realm');
		const guild = interaction.options.getString('guild');
		const all = interaction.options.getString('all');
		const channel = interaction.channel;

		// Check which option was provided and search based on that
		if (rio) {
			const result = await getBlacklistEntryByRio(rio)
			if (!result){
				await interaction.reply("User not found on blacklist");
				return
			}
			await interaction.reply("Found user:");
			CreateBlacklistEmbed(result.rio, result.name, result.realm, result.guild, result.reason, result.addedby, result.dateadded.toISOString().slice(0, 10), channel)
		} else if (name) {
			const results = await getBlacklistEntriesByName(name)
			console.log(results);
			if (!results.length > 0){
				await interaction.reply("No users found matching that name");
				return;
			}
			await interaction.reply("Found "+results.length+" users:");
			for (const result of results) {
				console.log(result)
				await CreateBlacklistEmbed(result.rio, result.name, result.realm, result.guild, result.reason, result.addedby, result.dateadded.toISOString().slice(0, 10), channel)
			}
		} else if (realm) {
			const results = await getBlacklistEntriesByRealm(realm)
			console.log(results);
			if (!results.length > 0){
				await interaction.reply("No users found from that realm");
				return;
			}
			await interaction.reply("Found "+results.length+" users:");
			for (const result of results) {
				console.log(result)
				await CreateBlacklistEmbed(result.rio, result.name, result.realm, result.guild, result.reason, result.addedby, result.dateadded.toISOString().slice(0, 10), channel)
			}
		} else if (guild) {
			const results = await getBlacklistEntriesByGuild(guild)
			console.log(results);
			if (!results.length > 0){
				await interaction.reply("No users found from that guild");
				return;
			}
			await interaction.reply("Found "+results.length+" users:");
			for (const result of results) {
				console.log(result)
				await CreateBlacklistEmbed(result.rio, result.name, result.realm, result.guild, result.reason, result.addedby, result.dateadded.toISOString().slice(0, 10), channel)
			}
		} else {
			await interaction.reply('Please provide a search parameter');
			return;
		}
	},
};