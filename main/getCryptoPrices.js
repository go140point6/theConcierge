require('dotenv').config({ path: '../.env' }); // Load .env file from root!
require('log-timestamp');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { createDecimalFormatter, createPercentFormatter } = require('../utils/intlNumberFormats');

let prices = {}

const id = [
    { id: 'bitcoin', ticker: 'btc', decimals: '1' },
    { id: 'ethereum', ticker: 'eth', decimals: '2' },
    { id: 'ripple', ticker: 'xrp', decimals: '4' },
    { id: 'flare-networks', ticker: 'flr', decimals: '5' },
    { id: 'songbird', ticker: 'sgb', decimals: '5' }
]

async function getCryptoPrices(client) {
    channel_pool = client.channels.cache.get(process.env.CHANNEL_ID_POOL)
    const decimalFormatter = createDecimalFormatter(2,2)
    const percentFormatter = createPercentFormatter(3,3)

    getCrypto(client)
}

async function getCrypto(client) {
    for (const crypto of id) {
        try {
            const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${crypto.id}`)
                if (res.data && res.data[0].current_price) {
                    let currentPrice = res.data[0].current_price.toFixed(crypto.decimals) || 0
                    //console.log("Current price of ", crypto.id, " is ", currentPrice)
                    prices[crypto.ticker] = currentPrice
                } else {
                    console.log("Error loading coin data")
                }
        } catch (error) {
            console.error(`Error fetching price for ${crypto.id}: ${error.message}`)
        }
    }
    //console.log(prices)
    await annoucePrices(client)
}

async function annoucePrices(client) {
    const embed = new EmbedBuilder()
    .setColor('LuminousVividPink')
    .setTitle(`Flavio here, need anything else?`)
    //.setAuthor({ name: client.user.username })
    .setDescription(`Current crypto prices in USD:`)
    .setThumbnail(client.user.avatarURL())
    .addFields(
        { name: 'Bitcoin:', value: `$${prices.btc}` },
        { name: 'Ethereum: ', value: `$${prices.eth}` },
        { name: 'XRP:', value: `$${prices.xrp}` },
        { name: 'Flare:', value: `$${prices.flr}` },
        { name: 'Songbird:', value: `$${prices.sgb}` },
    )
    //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
    .setTimestamp()
    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });    

    channel_pool.send({ embeds: [embed] })
}

module.exports = {
    getCryptoPrices
}