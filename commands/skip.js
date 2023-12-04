const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),

    execute: async ({client, interaction}) => {
        const player = client.player.nodes.get(interaction.guildId)

        if (!player){
            return await interaction.editReply("No songs are currently playing")
        }

        const currentSong = player.current
        player.stop()
        
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${currentSong.title} has been skipped`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
