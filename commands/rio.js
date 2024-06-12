const { SlashCommandBuilder } = require('discord.js');
const { CreateRioEmbed } = require('../rioembedbuilder.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rio')
		.setDescription('Look up rio score')
		.addStringOption
		(option =>
			option
				.setName('rio')
				.setDescription('The Raider.io link you want to look up')
				.setRequired(false)
			)
		.addStringOption
		(option => 
			option
				.setName('charname')
				.setDescription('The name of the character you want to look up, must provide realm aswell')
				.setRequired(false)
			)		
		.addStringOption
		(option => 
			option
				.setName('realm')
				.setDescription('The realm of the character you want to look up')
				.setRequired(false)
			),
	async execute(interaction) {

		const targetrio = interaction.options.getString('rio') ?? "";
		const charname = interaction.options.getString('charname') ?? "";
		const charrealm = interaction.options.getString('realm') ?? "";
        const channel = interaction.channel;
        const reply = "Getting data from raider.io"

        if (targetrio !== ""){
            interaction.reply(reply);
            lookupriourl(targetrio, channel);
        }
        else if (charname !== "" && charrealm !== ""){
            interaction.reply(reply);
            fetchdata(charname, charrealm, channel);
        }
        else{
            interaction.reply("Please provide either a r.io link or a name and realm");
        } 
        
	},
};

async function lookupriourl(riolink, channel){
    var decodedurl = decodeURIComponent(riolink);
	var cleanrio = decodedurl.replace('?utm_source=addon', "");
	console.log("clean:", cleanrio);

	const regex = /\/characters\/(?:eu|us|kr|tw|cn)\/([\w-]+)\/([^/?]+)/;
	const matches = cleanrio.match(regex);

	if (matches) {
		var realm = matches[1];
		var character = matches[2];
	}
    fetchdata(character, realm, channel);
}

async function fetchdata(charname, charrealm, channel){
    const regionName = "eu";
    
    fetch(`https://raider.io/api/v1/characters/profile?region=${regionName}&realm=${charrealm}&name=${charname}&fields=mythic_plus_scores`)
      .then(response => response.json())
      .then(data => {
        CreateRioEmbed(data, channel);
      })
      .catch(error => {
        console.error(error);
      });
}
