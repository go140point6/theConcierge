require('dotenv').config();
require('log-timestamp');
const { Client, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { onReady } = require('./events/onReady');
const { onInteraction } = require('./events/onInteraction');
const { onMessage } = require('./events/onMessage');
const { validateEnv } = require('./utils/validateEnv');
const { createMainArray, createSupportArrays } = require('./utils/createArrays');
// const { connectSongbird } = require('./utils/connectSongbirdInstances');
// const { connectFlare } = require('./utils/connectFlareInstances');
const { createCurrencyFormatter, createDecimalFormatter, createPercentFormatter } = require('./utils/intlNumberFormats');

(async () => {
    validateEnv();

    createMainArray()
    .then(() => {
        return createSupportArrays();
    })
    .then((namedArrays) => {
        module.exports.namedArrays = namedArrays
    })
    .catch((error) => {
        console.error(error)
    })

    /*
    connectSongbird()
    .then(( {registrySgbFtsoInstance, managerSgbFtsoInstance, wNatFlrInstance} ) => {
        console.log('Songbird FTSO registry initialized.')
        console.log('Songbird FTSO manager initialized.')
        module.exports.registrySgbFtsoInstance = registrySgbFtsoInstance
        module.exports.managerSgbFtsoInstance = managerSgbFtsoInstance
    })
    .catch((error) => {
        console.error(error)
    })

    connectFlare()
    .then(( {registryFlrFtsoInstance, managerFlrFtsoInstance, wNatFlrInstance} ) => {
        console.log('Flare FTSO registry initialized.')
        console.log('Flare FTSO manager initialized.')
        console.log('Flare WNat initialized.')
        module.exports.registryFlrFtsoInstance = registryFlrFtsoInstance
        module.exports.managerFlrFtsoInstance = managerFlrFtsoInstance
        module.exports.wNatFlrInstance = wNatFlrInstance
    })
    .catch((error) => {
        console.error(error)
    })
    */

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    client.once(Events.ClientReady, async() => await onReady(client));

    client.on(Events.InteractionCreate, async interaction => {
        onInteraction(interaction)
    });

    client.on(Events.MessageCreate, async(message) => await onMessage(message));

    await client.login(process.env.BOT_TOKEN);
})();