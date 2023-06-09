const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../index')
//const { client, registrySgbFtsoInstance, managerSgbFtsoInstance } = require('../index')
//const { registrySgbFtsoInstance, managerSgbFtsoInstance } = require('../index')
const { managerFlrFtsoInstance } = require('../events/onReady');


const slashCommand = new SlashCommandBuilder()
    .setName('epoch')
    .setDescription('Get current Epoch and Lock Deadline information for Songbird and Flare.')

    const NetworkOptions = option =>
        option.setName('network')
            .setDescription('What network do you want to check?')
            .setRequired(true)
            .addChoices(
                { name: 'Flare', value: 'flare' },
                { name: 'Songbird', value: 'songbird' },
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

        let network = (interaction.options.getString("network", true))
        //console.log(network)

        //let registrySgbFtsoInstance = client.registrySgbFtsoInstance
        //let managerFlrFtsoInstance = client.managerFlrFtsoInstance
        //let managerSgbFtsoInstance = client.managerSgbFtsoInstance

        //console.log(registrySgbFtsoInstance)
        console.log(managerFlrFtsoInstance)

        if (network === 'flare') {
            //managerFtsoInstance = client.managerFlrFtsoInstance
            managerFtsoInstance = managerFlrFtsoInstance
        } else if (network === 'songbird') {
            managerFtsoInstance = client.managerSgbFtsoInstance
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
