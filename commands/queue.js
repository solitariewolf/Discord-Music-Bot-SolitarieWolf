const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila de músicas.'),
    async execute({interaction, client}) {
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying())
            return await interaction.reply('Não há músicas tocando no momento.');

            const trackList = queue.tracks.map((track, i) => ({
                title: track.title,
                author: track.uploader ? track.uploader.name : 'Desconhecido',
                user: track.requestedBy,
                url: track.url,
                duration: track.duration
            }));
            

        // Cria um novo objeto de incorporação
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🎵 Fila de músicas')
            .addFields(trackList.map((data, i) =>
                ({ name: `#${i + 1}: ${data.title}`, value: `Adicionado por: ${data.user.username}\nDuração: ${data.duration}` })))

        // Envia a mensagem incorporada
        return await interaction.reply({ embeds: [embed] });
    },
};
