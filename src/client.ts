import chalk from "chalk"
import { getInboxPage } from "./msg/get-inbox.js"
import { archiveMessages, archivedCount } from "./msg/archive-messages.js"

export interface MessageCleanerClientProps {
  Cookie: string
  TradeOnly?: boolean
  RequestInterval?: number
}

export class MessageCleanerClient {
  page: number
  cookie: string
  tradeOnly?: boolean
  requestInterval: number

  constructor(props: MessageCleanerClientProps) {
    this.cookie = props.Cookie
    this.tradeOnly = props.TradeOnly
    this.requestInterval = props.RequestInterval || 0.5
    this.page = 0
  }

  public archivePage = async () => {
    const inboxData = await getInboxPage(this.cookie, this.page)
    if (!inboxData) {
      console.log(chalk.red("Failed to get inbox data."))
      return
    }
    let messagesToArchive = []
    console.log(
      chalk.blue(
        `Checking page: ${this.page}. Found: ${inboxData.Collection.length} messages.`
      )
    )

    let ignoredCount = 0
    for (const message of inboxData.Collection) {
      if (
        !message.subject.includes("You have a Trade request from ") &&
        !message.subject.includes("Your trade with ") &&
        !message.subject.includes(" has countered your Trade") &&
        !message.subject.includes(" could not be completed.") &&
        !message.subject.includes(" completed!") &&
        this.tradeOnly === true
      ) {
        ignoredCount++
        continue
      }
      messagesToArchive.push(message.id)
    }
    console.log(
      chalk.red(
        `Archiving ${messagesToArchive.length} messages. (ignoring ${ignoredCount} messages)`
      )
    )
    const res = await archiveMessages(this.cookie, messagesToArchive)
    if (res) {
      console.log(
        chalk.green(
          `Successfully archived ${res} messages! Total archived: ${archivedCount}`
        )
      )
    }

    return res
  }

  public archiveAll = async () => {
    setInterval(async () => {
      this.archivePage()
    }, this.requestInterval * 1000)
  }
}
