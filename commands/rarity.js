require('dotenv').config({ path: '../.env' }) // Load .env file from root!
require('log-timestamp')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const { namedArrays } = require('../index')

var tokenInfo = namedArrays['nftChoices']
var rarityOG = namedArrays['rarityOGInfo']
var rarityFrens = namedArrays['rarityFrensInfo']

const slashCommand = new SlashCommandBuilder()
    .setName(`rarity`)
    .setDescription(`Flaremingo family NFT rarity checker.`)

    const choices = tokenInfo.map((token) => {
        return { name: `${token.fullname}`, value: token.fullname }
    })

    const nftFamilyOption = option =>
        option.setName('project')
            .setDescription('What Flaremingo Family project would you like to check?')
            .setRequired(true)
            .addChoices(...choices) // Spread the choices array as separate arguments
    
    slashCommand.addStringOption(nftFamilyOption)

    const nftNumberOption = option =>
    option.setName('number')
        .setDescription('What number do you want to check?')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(888)

    slashCommand.addNumberOption(nftNumberOption)

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        await interaction.deferReply();  //requires interaction.editReply

        let nftFamily = (interaction.options.getString("project", true))
        let nftNumber = (interaction.options.getNumber("number", true))
        let ipfsFamily
        let rank 
        let size

        async function findRankByEdition(array, nftNumber) {
            const foundItem = array.find(item => item.edition === String(nftNumber))
            return foundItem ? foundItem.rank : null
        }

        if (nftFamily === 'Flaremingos') {
            array = rarityOG
            ipfsFamily = 'QmTaY5MS9trVXjFywtxW4D927KDY5r2GWthvdnwE2u1TQ8'
            rank = await findRankByEdition(array, nftNumber)
            size = rarityOG.length
        } else if (nftFamily === 'Flaremingo Frens') {
            array = rarityFrens
            ipfsFamily = 'QmTNmPZTGqsoRxLmj9idjCpdxLsY434PgTsHB2FkoiXEUE'
            rank = await findRankByEdition(array,nftNumber)
            size = rarityFrens.length
        } else {
            console.log("Some error with checking rarity.")
        }

        if (nftFamily === 'Flaremingos' && nftNumber === 141) {
            const embed = new EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(`Flavio here, need anything else?`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`Hot damn, that's a good looking mingo.  Officially Flaremingo #${nftNumber} is rank ${rank} of ${size} but some people just can't appreciate quality.`)
                .setThumbnail(client.user.avatarURL())
                //.addFields(...dexAmounts) // Spread the dexAmounts array as separate arguments
                .setImage(`https://ipfs.io/ipfs/${ipfsFamily}/${nftNumber}.png`)
                .setTimestamp()
                //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });
                //.setFooter({ text: "Not all DEX transactions can be carried out. Zero means no liquidity/missing pair. Try smaller amounts" })

                //interaction.editReply({ embeds: [embedPool]}); // when using deferReply
                //await interaction.reply({ embeds: [embed] });
            await interaction.editReply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(`Flavio here, need anything else?`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`${nftFamily} #${nftNumber} is rank ${rank} of ${size}!`)
                .setThumbnail(client.user.avatarURL())
                //.addFields(...dexAmounts) // Spread the dexAmounts array as separate arguments
                .setImage(`https://ipfs.io/ipfs/${ipfsFamily}/${nftNumber}.png`)
                .setTimestamp()
                //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });
                //.setFooter({ text: "Not all DEX transactions can be carried out. Zero means no liquidity/missing pair. Try smaller amounts" })

                //interaction.editReply({ embeds: [embedPool]}); // when using deferReply
                //await interaction.reply({ embeds: [embed] });
            await interaction.editReply({ embeds: [embed] }) 
        }
    } 
}

  