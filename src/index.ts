import chalk from "chalk"
import config from "./config.js"
import { MessageCleanerClient } from "./client.js"

const client = new MessageCleanerClient({
  Cookie: config.account.cookie,
  TradeOnly: config.settings.trade_messages_only,
  RequestInterval: config.settings.time_between_requests,
})

console.log(chalk.magenta("🧹 !! Starting cleaner !! 🧹"))
client.archiveAll()
