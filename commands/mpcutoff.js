const { SlashCommandBuilder } = require('discord.js');
const season = "2";
module.exports = {
	data: new SlashCommandBuilder()
		.setName('mpcutoff')
		.setDescription('Returns the current m+ cutoff for title'),
	async execute(interaction) {
        
        fetch('https://raider.io/api/v1/mythic-plus/season-cutoffs?season=season-df-2&region=eu')
            .then(response => response.json())
            .then(data => {
                const quantileMinValue = data.cutoffs.p999.all.quantileMinValue;
                interaction.reply("The current m+ cutoff for DF S2 title is "+quantileMinValue);
            })
            .catch(error => console.error(error));
	},
};

