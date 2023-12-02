const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música na fila.'),
    async execute({interaction, client}) {
        const queue = client.player.nodes.get(interaction.guildId);

        if (!interaction.member.voice.channelId)
            return await interaction.reply({ content: '❌ | Você não está em um canal de voz!', ephemeral: true });
        if (
            interaction.guild.members.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
        )
            return await interaction.reply({ content: '❌ | Você não está no meu canal de voz!', ephemeral: true });

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Nenhuma música está sendo reproduzida no momento!`, ephemeral: true });

            player.queue.previous = player.queue.current;
            player.stop();

        const stopembed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(currentTrack.thumbnail)
            .setColor('#FF0000')
            .setTitle(`Música pulada ⏭️`)
            .setDescription(
                `A música **${currentTrack.title}** foi pulada. ${
                    currentTrack.queryType != 'arbitrary' ? `(Link)` : ''
                }!`,
            )
            .setTimestamp()
            .setFooter({
                text: `Solicitado por: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
            });

        interaction.reply({ embeds: [stopembed] });
    },
};
