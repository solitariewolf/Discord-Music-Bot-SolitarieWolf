const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses or resumes the current track.'),
    async execute({client, interaction}) {
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

        var checkPause = queue.node.isPaused();

        const pauseembed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(queue.currentTrack.thumbnail)
            .setColor('#FF0000')
            .setTitle(`Música ${checkPause ? 'retomada' : 'pausada'} ⏸️`)
            .setDescription(
                `A reprodução foi **${checkPause ? 'retomada' : 'pausada'}**. Atualmente tocando ${queue.currentTrack.title} ${
                    queue.currentTrack.queryType != 'arbitrary' ? `(Link)` : ''
                }!`,
            )
            .setTimestamp()
            .setFooter({
                text: `Solicitado por: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
            });

        try {
            queue.node.setPaused(!queue.node.isPaused());
            interaction.reply({ embeds: [pauseembed] });
        } catch (err) {
            interaction.reply({
                content: `❌ | Ooops... algo deu errado, houve um erro ${
                    checkPause ? 'retomando' : 'pausando'
                } a música. Por favor, tente novamente.`,
                ephemeral: true,
            });
        }
    },
};
