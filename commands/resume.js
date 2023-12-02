const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Retoma a música atual.'),
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

        const resumeembed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(queue.currentTrack.thumbnail)
            .setColor('#FF0000')
            .setTitle(`Música retomada ⏯️`)
            .setDescription(
                `A reprodução foi **retomada**. Atualmente tocando ${queue.currentTrack.title} ${
                    queue.currentTrack.queryType != 'arbitrary' ? `(Link)` : ''
                }!`,
            )
            .setTimestamp()
            .setFooter({
                text: `Solicitado por: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
            });

        try {
            queue.node.setPaused(false);
            interaction.reply({ embeds: [resumeembed] });
        } catch (err) {
            interaction.reply({
                content: `❌ | Ooops... algo deu errado, houve um erro retomando a música. Por favor, tente novamente.`,
                ephemeral: true,
            });
        }
    },
};
