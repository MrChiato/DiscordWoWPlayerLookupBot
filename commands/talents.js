const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('talents')
    .setDescription('Returns the highest ranking talent build for an encounter and class')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('The content to search for')
        .setRequired(true)
        .addChoices(
          { name: 'Eranog', value: "2587" },
          { name: 'Terros', value: "2639" },
        )
    )
    .addStringOption(option =>
      option.setName('class')
        .setDescription('The class to search for')
        .setRequired(true)
        .addChoices(
          { name: 'Death Knight', value: 'death-knight' },
          { name: 'Demon Hunter', value: 'demon-hunter' },
          { name: 'Druid', value: 'druid' },
          { name: 'Hunter', value: 'hunter' },
          { name: 'Mage', value: 'mage' },
          { name: 'Monk', value: 'monk' },
          { name: 'Paladin', value: 'paladin' },
          { name: 'Priest', value: 'priest' },
          { name: 'Rogue', value: 'rogue' },
          { name: 'Shaman', value: 'shaman' },
          { name: 'Warlock', value: 'warlock' },
          { name: 'Warrior', value: 'warrior' },
        )
    )
    .addStringOption(option =>
      option.setName('spec')
        .setDescription('The specialization to search for')
        .setRequired(true)
    ),
    async execute(interaction) {
        const encounter = interaction.options.getString('content');
        const playerClass = interaction.options.getString('class');
        const playerSpec = interaction.options.getString('spec');
        const metric = 'dps';
      
        const url = `https://www.warcraftlogs.com:443/v1/rankings/encounter/${encounter}?metric=${metric}&includeCombatantInfo=true&api_key=9baf450985ce99384af07a34e92147b8`;
        //https://www.warcraftlogs.com:443/v1/rankings/encounter/2587?metric=dps&includeCombatantInfo=true&api_key=9baf450985ce99384af07a34e92147b8

        const response = await fetch(url);
        console.log(response);
        const json = await response.json();
      
        // Get rankings for the selected class and spec
        const rankings = json.rankings.filter((rank) => {
          return rank.spec === playerSpec && rank.class === playerClass;
        });
      
        if (rankings.length === 0) {
          await interaction.reply(`No rankings found for ${playerSpec} ${playerClass} on encounter ${encounter}`);
          return;
        }
      
        // Get talents for the top ranking player
        const topRanking = rankings[0];
        let talents = '';
        if (topRanking.talents) {
          talents = topRanking.talents.map((talent) => {
            return talent.id;
          }).join('/');
        }
      
        // Create the export string
        const exportString = `${playerClass}/${playerSpec}/${talents}`;
        await interaction.reply(`Top ${playerSpec} ${playerClass} talents for encounter ${encounter}: ${exportString}`);
      },
};  
