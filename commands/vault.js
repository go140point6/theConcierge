const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vault')
        .setDescription('Community Vault wallet for the MingoPool, a pool of assets owned by the Flaremingo NFT owners'),
        async execute(interaction) {
            //await interaction.deferReply();

			const embed = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				//.setDescription(`The query results for ${ticker}:`)
				.setThumbnail(client.user.avatarURL())
				.addFields(
					{ name: 'View the vault:', value: 'https://sparklesnft.com/profile/mingopool/'},
				)
				//.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				//interaction.editReply({ embeds: [embedPool]}); // when using deferReply
				interaction.reply({ embeds: [embed] });
		} 
}