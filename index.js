require('dotenv').config();
require('log-timestamp');
const { Client, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { onReady } = require('./events/onReady');
const { onInteraction } = require('./events/onInteraction');
const { onMessage } = require('./events/onMessage');
const { validateEnv } = require('./utils/validateEnv');
const { createMainArray, createSupportArrays } = require('./utils/createArrays');
//const { connectSongbird } = require('./utils/connectSongbirdInstances');
const { connectFlare } = require('./utils/connectFlareInstances');
const { createCurrencyFormatter, createDecimalFormatter, createPercentFormatter } = require('./utils/intlNumberFormats');

(async () => {
    validateEnv();

    // await createMainArray()
    // .then(() => {
    //     return createSupportArrays();
    // })
    // .then((namedArrays) => {
    //     module.exports.namedArrays = namedArrays
    // })
    // .catch((error) => {
    //     console.error(error)
    // })

    // const {registrySgbFtsoInstance, managerSgbFtsoInstance} = await connectSongbird();

    // console.log('Songbird FTSO registry initialized.');
    // console.log('Songbird FTSO manager initialized.');
    // //module.exports.registrySgbFtsoInstance = registrySgbFtsoInstance;
    // //module.exports.managerSgbFtsoInstance = managerSgbFtsoInstance;

    const {registryFlrFtsoInstance, managerFlrFtsoInstance, wNatFlrInstance} = await connectFlare();

    console.log('Flare FTSO registry initialized.');
    console.log('Flare FTSO manager initialized.');
    console.log('Flare WNat initialized.');
    //module.exports.registryFlrFtsoInstance = registryFlrFtsoInstance;
    //module.exports.managerFlrFtsoInstance = managerFlrFtsoInstance;
    module.exports.wNatFlrInstance = wNatFlrInstance;

    //const mingoPoolAddress = "0xF837a20EE9a11BA1309526A4985A3B72278FA722"
    //console.log(wNatFlrInstance)
    //wFlrBalanceNewNum = (Number(await wNatFlrInstance.balanceOf(mingoPoolAddress))/1e18)
    //console.log("From index.js:", wFlrBalanceNewNum)

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    client.once(Events.ClientReady, async() => await onReady(client, wNatFlrInstance));

    client.on(Events.InteractionCreate, async interaction => {
        onInteraction(interaction)
    });

    client.on(Events.MessageCreate, async(message) => await onMessage(message));

    await client.login(process.env.BOT_TOKEN);
})();