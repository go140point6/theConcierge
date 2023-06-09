require('dotenv').config({ path: '../.env' }) // Load .env file from root!
require('log-timestamp')
const ethers = require('ethers')
const fs = require('fs')

async function connectFlare() {
  // All Flare's smart contracts (Flare, Songbird, Conston, Conston2) retrieved from here
  // Use it to get all other contracts (by name for example) 
  const contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"

  const abiContractRegistry = JSON.parse(fs.readFileSync(`./abi/flareContractRegistry.abi`)) // Note that the contract is the same for SGB, FLR, Conston, and Conston2 as noted
  const abiFlrFtsoRegistry = JSON.parse(fs.readFileSync(`./abi/flrFtsoRegistry.abi`))
  const abiFlrFtsoManager = JSON.parse(fs.readFileSync(`./abi/flrFtsoManager.abi`))
  const abiFlrWNat = JSON.parse(fs.readFileSync(`./abi/flareWFlrContract.abi`))

  const provider = new ethers.JsonRpcProvider(
    `${process.env.FLR_PROVIDER}`
  )

  const registryContractInstance = new ethers.Contract(
    contractRegistryAddress,
    abiContractRegistry,
    provider
  )

  const ftsoFlrRegistryAddress = await registryContractInstance.getContractAddressByName("FtsoRegistry")
  const ftsoFlrManagerAddress = await registryContractInstance.getContractAddressByName("FtsoManager")
  const wNatFlrAddress = await registryContractInstance.getContractAddressByName("WNat")

  const registryFlrFtsoInstance = new ethers.Contract(
    ftsoFlrRegistryAddress,
    abiFlrFtsoRegistry,
    provider
  )

  const managerFlrFtsoInstance = new ethers.Contract(
    ftsoFlrManagerAddress,
    abiFlrFtsoManager,
    provider
  )
  
  const wNatFlrInstance = new ethers.Contract(
    wNatFlrAddress,
    abiFlrWNat,
    provider
  )

  return {
    registryFlrFtsoInstance,
    managerFlrFtsoInstance,
    wNatFlrInstance
  }
}

module.exports = { 
  connectFlare
}
