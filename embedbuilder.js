const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

async function CreateBlacklistEmbed(rio, charname, realm, guild = null, reason, addedby = null, dateadded = null, channel) {
  const blacklistEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(charname)
    .setURL(rio)
    .setDescription(reason)
    .setThumbnail("http://cdnassets.raider.io/images/fb_app_image.jpg?2019-11-18")
    .addFields(
        { name: 'Realm', value: realm, inline: true },
        { name: 'Guild', value: guild, inline: true },
        { name: 'Added by', value: addedby, inline: true },
        { name: 'Added on', value: dateadded, inline: true },
    )
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('addUser')
            .setLabel('Add to blacklist')
            .setStyle(ButtonStyle.Primary),
        
        new ButtonBuilder()
            .setCustomId('removeUser')
            .setLabel('Remove from blacklist')
            .setStyle(ButtonStyle.Secondary),
    )

    channel.send({ embeds: [blacklistEmbed], components: [row] })
    return blacklistEmbed;
};

module.exports = {
    CreateBlacklistEmbed
  }
