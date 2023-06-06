require('dotenv').config({ path: '../.env' }) // Load .env file from root!
require('log-timestamp')
const ethers = require('ethers')
const fs = require('fs')
//const { getBasePrice } = require('./getBasePrice.js')
const { namedArrays } = require('../index')

let provider
let baseToken

async function getNetwork(network) {
  if (network === 'songbird') {
    provider = new ethers.JsonRpcProvider(`${process.env.SGB_PROVIDER}`)
    baseToken = 'sgb'
    return {
      provider,
      baseToken,
      network
    }
  } else if ( network === 'flare' ) {
    provider = new ethers.JsonRpcProvider(`${process.env.FLR_PROVIDER}`)
    baseToken = 'flr'
    return {
      provider,
      baseToken,
      network
    }
  } else {
    console.log("Some error with network")
  }
}

const dexTokenAmountArray = new Map()

async function getTokenInfo(tokenInfo, ticker) {
  const allTokenInfo = {}
  for (const item of tokenInfo) {
    allTokenInfo[item.ticker] = item
  }
  return allTokenInfo[ticker] ? allTokenInfo[ticker].address : null
}

async function getCurrentPrice(nick, name, router, abi, sellTokenAddress, buyTokenAddress, amount, sellToken, buyToken, network) {
  let buyTokenAmount = 0
  try {
    let parsedJsonAbi = JSON.parse(fs.readFileSync(`./abi/${abi}`))
    const routerInstance = new ethers.Contract(
      router,
      parsedJsonAbi,
      provider
    )
    
    //const baseUSD = await getBasePrice(network)
    //console.log(`${baseToken} token is ${process.env.CURRENCY_SYMBOL}${baseUSD}`)

    const result = await routerInstance.getAmountsOut(
        //ethers.utils.parseEther(amount.toString()), // v5
        ethers.parseEther(amount.toString()), // v6
        [sellTokenAddress, buyTokenAddress]
    )
    
    //let sellTokenAmount = Number(result[0]) / 1e18
    let buyTokenAmount = Number(result[1]) / 1e18

    //console.log(sellTokenAmount)
    //console.log(buyTokenAmount)

    if (!Number.isNaN(buyTokenAmount)) {
      console.log(`On ${name}, you can sell ${amount} ${sellToken} and receive ${buyTokenAmount} ${buyToken}`)  
      dexTokenAmountArray.set(nick, { name, buyTokenAmount })
    }
    
  } catch (error) {
    //if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
      //console.log(`${name} has Insufficient Liquidity`)
    //} else {
      dexTokenAmountArray.set(nick, { name, buyTokenAmount }) // Sets buyTokenAmount to '0' from let statement above.
      console.log(`${name} has the following error with the ${sellToken}-${buyToken} pair: ${error.reason}`)  
    }
  }
//}

const getTokenPrice = async (sellToken, buyToken, amount, network, tokenInfo, dexInfo) => {
  const sellTokenAddress = await getTokenInfo(tokenInfo, sellToken)
  const buyTokenAddress = await getTokenInfo(tokenInfo, buyToken)

  //console.log(`Address for sell token ${sellToken}: ${sellTokenAddress}`)
  //console.log(`Address for buy token ${buyToken}: ${buyTokenAddress}`)

  await getNetwork(network)
  .then(({ provider, baseToken, network }) => {
    //console.log(baseToken)
    //console.log(network)
    //console.log(managerFlrFtsoInstance)
  })
    .catch(error => {
      console.error('Error occurred during getNetwork', error)
    })

  try {
    for (const row of dexInfo) {
      const nick = row.nick
      const name = row.name
      const router = row.router
      const abi = row.abi
      await getCurrentPrice(nick, name, router, abi, sellTokenAddress, buyTokenAddress, amount, sellToken, buyToken, network)
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = { 
  getTokenPrice,
  dexTokenAmountArray
}