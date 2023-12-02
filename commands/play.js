const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduz uma música.')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('O nome da música que você deseja tocar.')
                .setRequired(true)),
    async execute({interaction, client}) {
        const song = interaction.options.getString('nome');
        let queue = client.player.nodes.get(interaction.guildId);

        // verificar se o usuário está em um canal de voz
        if (!interaction.member || !interaction.member.voice || !interaction.member.voice.channelId)
            return await interaction.reply('Você precisa estar em um canal de voz para tocar música.');
        
        if (!queue) {
            queue = await client.player.nodes.create(interaction.guildId);
            queue.connect(interaction.member.voice.channelId);
        }

        const track = await client.player.search(song, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track)
            return await interaction.reply(`A música ${song} não foi encontrada.`);

        queue.play(track);

        // Cria um novo objeto de incorporação
        const embed = {
            color: 0x0099FF,
            title: '🎵 Agora tocando',
            description: `**${track.title}**`,
            fields: [
                { name: 'URL', value: track.url },
                { name: 'Adicionado por', value: interaction.user.username },
                { name: 'Duração', value: track.duration }
            ],
            footer: {
                text: 'Github Developer @SolitarieWolf',
                icon_url: 'https://avatars.githubusercontent.com/u/66285513?v=4',
            },
            thumbnail: {
                url: track.thumbnail // Adiciona a capa da música
            }
        };

        // Envia a mensagem incorporada
        return await interaction.reply({ embeds: [embed] });
        
    },
};
