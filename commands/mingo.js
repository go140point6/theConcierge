const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mingo')
        .setDescription('Show me a random mingo.'),
        async execute(interaction) {
			let thumb
			let author
			try {
				//await interaction.deferReply();

				const res = await axios.get(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=flamingo`)
				thumb = res.data.urls.thumb
				author = res.data.user.username

				const embedMain = new EmbedBuilder()
					.setColor('LuminousVividPink')
					.setTitle(`Flavio here, need anything else?`)
					//.setAuthor({ name: client.user.username })
					.setDescription(`How's this beautiful mingo?`)
					.setThumbnail(client.user.avatarURL())
					.setImage(`${thumb}`)
					.setTimestamp()
					.setFooter({ text: `Thanks to https://unsplash.com/@${author}` });

					interaction.reply({ embeds: [embedMain]});
		} catch (error) {
			console.log(error)

			const embedError = new EmbedBuilder()
			.setColor('LuminousVividPink')
			.setTitle(`Flavio here, need anything else?`)
			//.setAuthor({ name: client.user.username })
			.setDescription(`Call the poolboy, something went wrong with the command.`)
			.setThumbnail(client.user.avatarURL())
			//.setImage(`${thumb}`)
			.setTimestamp()
			//.setFooter({ text: `Thanks to https://unsplash.com/@${author}` });

			interaction.reply({ embeds: [embedError]});
		}
	}
}