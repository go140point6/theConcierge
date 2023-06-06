async function onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        await command.execute(interaction);
    } else if (interaction.isButton()) {
        //console.log(interaction);
    } else if (interaction.isStringSelectMenu()) {
        //console.log(interaction)
        //interaction.reply({ content: 'SGB' })
    } else {
        return;
    }
};

module.exports = { 
    onInteraction
}