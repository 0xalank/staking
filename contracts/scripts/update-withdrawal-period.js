const quais = require('quais')
require('dotenv').config()

const SmartChefNativeJson = require('../../artifacts/contracts/SmartChefNative.sol/SmartChefNative.json')

// Contract address - update this or set in .env
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS

async function updateWithdrawalPeriod() {
  // Get period from command line args
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: node update-withdrawal-period.js <seconds>')
    console.log('')
    console.log('Examples:')
    console.log('  node update-withdrawal-period.js 300        # 5 minutes')
    console.log('  node update-withdrawal-period.js 3600       # 1 hour')
    console.log('  node update-withdrawal-period.js 86400      # 1 day')
    console.log('  node update-withdrawal-period.js 2592000    # 30 days')
    console.log('')
    console.log('Max allowed: 5184000 (60 days)')
    process.exit(1)
  }

  const newPeriodSeconds = parseInt(args[0])

  if (isNaN(newPeriodSeconds) || newPeriodSeconds < 0) {
    console.error('Error: Invalid period. Must be a positive number.')
    process.exit(1)
  }

  if (newPeriodSeconds > 60 * 24 * 60 * 60) {
    console.error('Error: Period cannot exceed 60 days (5184000 seconds)')
    process.exit(1)
  }

  console.log('=== Update Withdrawal Lock Period ===\n')
  console.log('Contract:', CONTRACT_ADDRESS)

  // Setup provider and wallet
  const provider = new quais.JsonRpcProvider(process.env.RPC_URL, undefined, { usePathing: true })
  const wallet = new quais.Wallet(process.env.CYPRUS1_PK, provider)

  console.log('Admin wallet:', wallet.address)

  // Connect to contract
  const contract = new quais.Contract(CONTRACT_ADDRESS, SmartChefNativeJson.abi, wallet)

  // Get current period
  const currentPeriod = await contract.withdrawalLockPeriod()
  const currentDays = Number(currentPeriod) / 86400

  console.log('')
  console.log('Current period:', Number(currentPeriod), 'seconds (', currentDays.toFixed(2), 'days)')
  console.log('New period:', newPeriodSeconds, 'seconds (', (newPeriodSeconds / 86400).toFixed(2), 'days)')
  console.log('')

  // Send transaction
  console.log('Sending transaction...')
  const tx = await contract.updateWithdrawalLockPeriod(newPeriodSeconds, { gasLimit: 100000 })
  console.log('Transaction hash:', tx.hash)

  // Wait for confirmation
  console.log('Waiting for confirmation...')
  await tx.wait()

  // Verify new period
  const updatedPeriod = await contract.withdrawalLockPeriod()
  console.log('')
  console.log('✅ Updated! New period:', Number(updatedPeriod), 'seconds (', (Number(updatedPeriod) / 86400).toFixed(2), 'days)')
}

updateWithdrawalPeriod()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error.message)
    process.exit(1)
  })
