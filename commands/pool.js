const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
//const axios = require('axios');
//const currentFLR = require('../events/onReady');
//const currentWFLR = require('../events/onReady');
const { connectFlare } = require('../utils/connectFlareInstances');
const { createCurrencyFormatter, createDecimalFormatter } = require('../utils/intlNumberFormats')

const mingoPoolAddress = "0xF837a20EE9a11BA1309526A4985A3B72278FA722"
const decimalFormatter = createDecimalFormatter(2,2)
const currencyFormatter = createCurrencyFormatter('USD',2,2)

let wFlrBalanceFormatted
let flrPoolUSD
let perMingoWFlr
let perMingoUSD

const slashCommand = new SlashCommandBuilder()
    .setName(`pool`)
    .setDescription(`MingoPool balance in wFLR and USD.`)

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        await interaction.deferReply();  //requires interaction.editReply
        const { registryFlrFtsoInstance, wNatFlrInstance } = await connectFlare();

        try {
            let wFlrBalance = (Number(await wNatFlrInstance.balanceOf(mingoPoolAddress))/1e18)
            wFlrBalanceFormatted = decimalFormatter.format(wFlrBalance)

            let results = await registryFlrFtsoInstance["getCurrentPriceWithDecimals(string)"]('FLR')
            let decimals = Number(results._assetPriceUsdDecimals)
            let baseUSD = Number(results._price) / 10 ** decimals
            let flrPool = baseUSD * wFlrBalance
            flrPoolUSD = currencyFormatter.format(flrPool)

            perMingo = wFlrBalance / 1776
            perMingoWFlr = decimalFormatter.format(perMingo)
            perMingoUSD = currencyFormatter.format(perMingo * baseUSD)

            const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(`Flavio here, need anything else?`)
            //.setAuthor({ name: client.user.username })
            //.setDescription(`Mingo`)
            .setThumbnail(client.user.avatarURL())
            .addFields(
                { name: 'Pool Value (wFLR):', value: `${wFlrBalanceFormatted}` },
                { name: 'Pool USD Value:', value: `${flrPoolUSD}` },
                { name: 'Pool Share per Mingo in wFLR and USD:', value: `${perMingoWFlr} wFlr (${perMingoUSD})` },
            )
            //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
            .setTimestamp()
            .setFooter({ text: 'Pool size is currently 1776 (Flaremingos and Flaremingo Frens). Some FLR may still need to be wrapped.' });
        
            interaction.editReply({ embeds: [embed]});
        } catch(error) {
            console.log(error)
            const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(`Flavio here, need anything else?`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Some error getting balance information from the Flare blockchain, please try again or see if the poolboy is sober enough to assist.`)
            .setThumbnail(client.user.avatarURL())
            //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
            .setTimestamp()
            //.setFooter({ text: 'Pool size is currently 1776 (Flaremingos and Flaremingo Frens). Some FLR may still need to be wrapped.' });
        
            interaction.editReply({ embeds: [embed]});
        }
    }
}