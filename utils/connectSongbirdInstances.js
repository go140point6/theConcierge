require('dotenv').config({ path: '../.env' }) // Load .env file from root!
require('log-timestamp')
const ethers = require('ethers')
const fs = require('fs')

async function connectSongbird() {
  // All Flare's smart contracts (Flare, Songbird, Conston, Conston2) retrieved from here
  // Use it to get all other contracts (by name for example) 
  const contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"

  const abiContractRegistry = JSON.parse(fs.readFileSync(`./abi/flareContractRegistry.abi`)) // Note that the contract is the same for SGB, FLR, Conston, and Conston2 as noted
  const abiSgbFtsoRegistry = JSON.parse(fs.readFileSync(`./abi/sgbFtsoRegistry.abi`))
  const abiSgbFtsoManager = JSON.parse(fs.readFileSync(`./abi/sgbFtsoManager.abi`))

  const provider = new ethers.JsonRpcProvider(
    `${process.env.SGB_PROVIDER}`
  )

  const registryContractInstance = new ethers.Contract(
    contractRegistryAddress,
    abiContractRegistry,
    provider
  )

  const ftsoSgbRegistryAddress = await registryContractInstance.getContractAddressByName("FtsoRegistry")
  const ftsoSgbManagerAddress = await registryContractInstance.getContractAddressByName("FtsoManager")

  registrySgbFtsoInstance = new ethers.Contract(
    ftsoSgbRegistryAddress,
    abiSgbFtsoRegistry,
    provider
  )

  managerSgbFtsoInstance = new ethers.Contract(
    ftsoSgbManagerAddress,
    abiSgbFtsoManager,
    provider
  )
  
  return {
    registrySgbFtsoInstance,
    managerSgbFtsoInstance
  } 
}

module.exports = { 
  connectSongbird
}
