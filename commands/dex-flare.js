const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const { namedArrays } = require('../index')
const { getTokenPrice, dexTokenAmountArray } = require('../main/getTokenPrice');

var network = "flare"
//console.log(network)

let tokenInfoTemp = `${network}TokenInfo`
//console.log(tokenInfoTemp)
var tokenInfo = namedArrays[tokenInfoTemp]
//console.log(tokenInfo)
let dexInfoTemp = `${network}DexInfo`
//console.log(dexInfoTemp)
var dexInfo = namedArrays[dexInfoTemp]
//console.log(dexInfo)

const slashCommand = new SlashCommandBuilder()
    .setName(`dex-${network}`)
    .setDescription(`Got tokens to buy or sell on a ${network} DEX?  Find which offers the best current prices.`)

    const choices = tokenInfo.map((token) => {
        return { name: `${token.ticker} (${token.fullname})`, value: token.ticker }
    })

    const sellTokenOptions = option =>
        option.setName('sell-token')
            .setDescription('What token are you selling?')
            .setRequired(true)
            .addChoices(...choices) // Spread the choices array as separate arguments
    
    slashCommand.addStringOption(sellTokenOptions)

    const amountOfTokens = option =>
    option.setName('amount')
        .setDescription('How much are you selling?')
        .setRequired(true)

    slashCommand.addNumberOption(amountOfTokens)

    const buyTokenOptions = option =>

        option.setName('buy-token')
            .setDescription('What token are you buying?')
            .setRequired(true)
            .addChoices(...choices) // Spread the buyTokenChoices array as separate arguments
    
    slashCommand.addStringOption(buyTokenOptions)

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        await interaction.deferReply(({ ephemeral: true }));  //requires interaction.editReply

        const sellToken = (interaction.options.getString("sell-token", true))
        const amount = (interaction.options.getNumber("amount", true))
        const buyToken = (interaction.options.getString("buy-token", true))
        
        await getTokenPrice(sellToken, buyToken, amount, network, tokenInfo, dexInfo)
       
        const dexAmounts = Array.from(dexTokenAmountArray, ([key, value]) => {
            return { name: value.name, value: value.buyTokenAmount.toFixed(3) + ' ' + buyToken }
        })
 
        const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(`Flavio here, need anything else?`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`You want to sell ${amount} ${sellToken} in exchange for ${buyToken}:`)
            .setThumbnail(client.user.avatarURL())
            .addFields(...dexAmounts) // Spread the dexAmounts array as separate arguments
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });
            .setFooter({ text: "Not all DEX transactions can be carried out. Zero means no liquidity/missing pair. Try smaller amounts" })

            //interaction.editReply({ embeds: [embedPool]}); // when using deferReply
            //await interaction.reply({ embeds: [embed] });
            await interaction.editReply({ embeds: [embed] })
    } 
}