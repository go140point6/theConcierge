const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../index')
const { connectFlare } = require('../utils/connectFlareInstances');
const { connectSongbird } = require('../utils/connectSongbirdInstances');
//const { client, registrySgbFtsoInstance, managerSgbFtsoInstance } = require('../index')
//const { registrySgbFtsoInstance, managerSgbFtsoInstance } = require('../index')


const slashCommand = new SlashCommandBuilder()
    .setName('epoch')
    .setDescription('Get current Epoch and Lock Deadline information for Flare.')

    const NetworkOptions = option =>
        option.setName('network')
            .setDescription('What network do you want to check? (Only Flare for now)')
            .setRequired(true)
            .addChoices(
                { name: 'Flare', value: 'flare' },
            )
    
    slashCommand.addStringOption(NetworkOptions)

let epoch
let epochEndsDate
let epochLockDeadlineDate
let managerFtsoInstance

module.exports = {
    data: slashCommand,
    async execute(interaction) {
        await interaction.deferReply();  //requires interaction.editReply

        const { managerFlrFtsoInstance } = await connectFlare();
        const { managerSgbFtsoInstance } = await connectSongbird();

        let network = (interaction.options.getString("network", true))
        //console.log(network)

        //let registrySgbFtsoInstance = client.registrySgbFtsoInstance
        //let managerFlrFtsoInstance = client.managerFlrFtsoInstance
        //let managerSgbFtsoInstance = client.managerSgbFtsoInstance

        //console.log(registrySgbFtsoInstance)
        //console.log(managerSgbFtsoInstance)

        if (network === 'flare') {
            managerFtsoInstance = managerFlrFtsoInstance
        } else if (network === 'songbird') {
            managerFtsoInstance = managerSgbFtsoInstance
        }
        try {
        epoch = Number(await managerFtsoInstance.getCurrentRewardEpoch()) // Number
        //let epochExpire = Number(await managerFtsoInstance.getRewardEpochToExpireNext()) // Number
        let epochEnds = (Number(await managerFtsoInstance.currentRewardEpochEnds()))*1000 // Seconds
        epochEndsDate = new Date(Number(await managerFtsoInstance.currentRewardEpochEnds())*1000).toLocaleString() // Date
        let epochDuration = (Number(await managerFtsoInstance.rewardEpochDurationSeconds()))*1000 // Seconds
        let epochLockDeadline = epochDuration / 2 // Seconds
        epochLockDeadlineDate = new Date(epochEnds - epochLockDeadline).toLocaleString()

        const embed = new EmbedBuilder()
        .setColor('LuminousVividPink')
        .setTitle(`Flavio here, need anything else?`)
        //.setAuthor({ name: client.user.username })
        .setDescription(`Current ${network} Epoch and Lock Deadline information:`)
        .setThumbnail(client.user.avatarURL())
        .addFields(
            { name: 'Current epoch: ', value: `${epoch}`},
            { name: 'Current epoch ends (PDT): ', value: `${epochEndsDate}`},
            { name: 'Start of lock zone for current epoch (PDT): ', value: `${epochLockDeadlineDate}`},
        )
        //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
        .setTimestamp()
        //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

        interaction.editReply({ embeds: [embed]});

        } catch (error) {
            console.log(error)

            const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(`Flavio here, need anything else?`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Songbird is under construction, please only use Flare for now.`)
            .setThumbnail(client.user.avatarURL())
            /*
            .addFields(
                { name: 'Current epoch: ', value: `${epoch}`},
                { name: 'Current epoch ends (PDT): ', value: `${epochEndsDate}`},
                { name: 'Start of lock zone for current epoch (PDT): ', value: `${epochLockDeadlineDate}`},
            )
            */
            //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
            .setTimestamp()
            //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });
    
            interaction.editReply({ embeds: [embed]});
        }
    }
} 
