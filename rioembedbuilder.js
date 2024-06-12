const { EmbedBuilder } = require('discord.js');
const { getBlacklistEntryByRio } = require('./dbconnections');

async function CreateRioEmbed(riodata, channel) {
    const result = await getBlacklistEntryByRio(riodata.profile_url);
    var blacklistresult = " ";
    if(result)
        blacklistresult = (riodata.name+" is on the blacklist!");
  const rioEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(riodata.name)
    .setURL(riodata.profile_url)
    .setDescription(blacklistresult)
    .setThumbnail(riodata.thumbnail_url)
    .addFields(
        { name: 'Overall', value: String(riodata.mythic_plus_scores.all) },
        { name: 'DPS', value: String(riodata.mythic_plus_scores.dps), inline: true },
        { name: 'Tank', value: String(riodata.mythic_plus_scores.tank), inline: true },
        { name: 'Healer', value: String(riodata.mythic_plus_scores.healer), inline: true },
    )
    .setTimestamp();

    channel.send({ embeds: [rioEmbed] })
    return rioEmbed;
};

module.exports = {
    CreateRioEmbed
  }
