require('dotenv').config({ path: '../.env' }); // Load .env file from root!
require('log-timestamp');
const { EmbedBuilder } = require('discord.js');
const { createDecimalFormatter, createPercentFormatter } = require('../utils/intlNumberFormats');

let wFlrBalanceOldNum = 0
let wFlrBalanceNewNum
let wFlrBalanceOld
let wFlrBalanceNew
let channel_pool
let percent

async function getPoolChanges(client, wNatFlrInstance) {
    channel_pool = client.channels.cache.get(process.env.CHANNEL_ID_POOL)
    const mingoPoolAddress = "0xF837a20EE9a11BA1309526A4985A3B72278FA722"
    const decimalFormatter = createDecimalFormatter(2,2)
    const percentFormatter = createPercentFormatter(3,3)

    try {
        
        wFlrBalanceNewNum = (Number(await wNatFlrInstance.balanceOf(mingoPoolAddress))/1e18)
        //console.log("From getPoolChanges:", wFlrBalanceNewNum)
        
        if ( wFlrBalanceOldNum === 0 ) {
            wFlrBalanceOldNum = wFlrBalanceNewNum

        } else if ( wFlrBalanceNewNum > wFlrBalanceOldNum ) {
            let change = -(1-(wFlrBalanceNewNum/wFlrBalanceOldNum))
            percent = percentFormatter.format(change)
            wFlrBalanceNew = decimalFormatter.format(wFlrBalanceNewNum)
            wFlrBalanceOld = decimalFormatter.format(wFlrBalanceOldNum)
            await poolIncrease(client)
            wFlrBalanceOldNum = wFlrBalanceNewNum

        } else if ( wFlrBalanceNewNum < wFlrBalanceOldNum ) {
            let change = 1-(wFlrBalanceNewNum/wFlrBalanceOldNum)
            percent = percentFormatter.format(change)
            wFlrBalanceNew = decimalFormatter.format(wFlrBalanceNewNum)
            wFlrBalanceOld = decimalFormatter.format(wFlrBalanceOldNum)
            await poolDecrease(client)
            wFlrBalanceOldNum = wFlrBalanceNewNum

        } else if ( wFlrBalanceNewNum === wFlrBalanceOldNum ) {
            console.log("No detected changes in the MingoPool.")
        }
        
    } catch (error) {
        console.log(error)
    }
}

async function poolIncrease(client) {

    const embed = new EmbedBuilder()
    .setColor('LuminousVividPink')
    .setTitle(`Flavio here, need anything else?`)
    //.setAuthor({ name: client.user.username })
    .setDescription(`The MingoPool has increased by ${percent}!`)
    .setThumbnail(client.user.avatarURL())
    .addFields(
        { name: 'Old Balance: ', value: `${wFlrBalanceOld} wFLR` },
        { name: 'New Balance: ', value: `${wFlrBalanceNew} wFLR` },
    )
    //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
    .setTimestamp()
    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });    

    channel_pool.send({ embeds: [embed] })
}

async function poolDecrease(client) {

    const embed = new EmbedBuilder()
    .setColor('LuminousVividPink')
    .setTitle(`Flavio here, need anything else?`)
    //.setAuthor({ name: client.user.username })
    .setDescription(`The MingoPool has decreased by ${percent}!`)
    .setThumbnail(client.user.avatarURL())
    .addFields(
        { name: 'Old Balance: ', value: `${wFlrBalanceOld} wFLR` },
        { name: 'New Balance: ', value: `${wFlrBalanceNew} wFLR` },
    )
    //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
    .setTimestamp()
    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });    

    channel_pool.send({ embeds: [embed] })
}

module.exports = {
    getPoolChanges
}