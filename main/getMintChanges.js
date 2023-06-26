require('dotenv').config({ path: '../.env' }); // Load .env file from root!
require('log-timestamp');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { createDecimalFormatter, createPercentFormatter } = require('../utils/intlNumberFormats');

const percentFormatter = createPercentFormatter(2,2)

var prevMint
var currentMint
var netMint

async function getMint(client) {
    await axios.get(`https://flare-explorer.flare.network/api?module=stats&action=tokensupply&contractaddress=0x537041cc88ec017046908b050e8fae1a7f3729e0`).then(res => {
        currentMint = res.data.result
        if (prevMint == null) {
            console.log("Gator mint stands at: ", currentMint)
            prevMint = currentMint
            //prevMint = 2240
        } else if ( currentMint > prevMint ) {
            netMint = ( currentMint - prevMint )
            console.log("Gator mint increased by: ", netMint)
            showMint(client)
        }
        //module.exports.currentMint = currentMint;
    })
}

async function showMint(client) {

    channel_mint = client.channels.cache.get(process.env.CHANNEL_ID_MINT)
    let netMintPerc = (currentMint/5555)
    let totalPerc = percentFormatter.format(netMintPerc)

    const embed = new EmbedBuilder()
    .setColor('LuminousVividPink')
    .setTitle(`Flavio here, need anything else?`)
    //.setAuthor({ name: client.user.username })
    .setDescription(`DeleGator update:`)
    .setThumbnail(client.user.avatarURL())
    .addFields(
        { name: 'Number of recent mints: ', value: `${netMint}` },
        { name: 'Total DeleGator mints: ', value: `${currentMint}` },
        { name: 'Percent claimed: ', value: `${totalPerc}` },
        { name: 'Last Mint: ', value: 'shown below' },
    )
    .setImage(`https://delegators.nyc3.cdn.digitaloceanspaces.com/gator/public/assets/${currentMint}.png`)
    .setTimestamp()
    .setFooter({ text: 'Note: The first 1776 of the total were reserved to airdrop to current Flaremingos and Flaremingo Frens holders.' });    

    channel_mint.send({ embeds: [embed] })
}

//getMint()

module.exports = {
    getMint
}