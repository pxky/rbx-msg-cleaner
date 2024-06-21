import chalk from "chalk"
import { getInboxPage } from "./msg/get-inbox.js"
import { archiveMessages, archivedCount } from "./msg/archive-messages.js"

export interface MessageCleanerClientProps {
  Cookie: string
  TradeOnly?: boolean
}

export class MessageCleanerClient {
  cookie: string
  tradeOnly?: boolean
  page: number

  constructor(props: MessageCleanerClientProps) {
    this.cookie = props.Cookie
    this.tradeOnly = props.TradeOnly
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
        this.tradeOnly === true &&
        !message.subject.includes("You have a Trade request from ") &&
        !message.subject.includes("Your trade with ")
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
    while (true) {
      const archivedMessages = (await this.archivePage()) as number

      if (archivedMessages === 0) {
        this.page++
        console.log(
          chalk.yellow(`No messages to archive. Moving to page: ${this.page}`)
        )
      }
    }
  }
}
