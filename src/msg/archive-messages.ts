import axios from "axios"
import chalk from "chalk"

export let archivedCount = 0
let csrf = "hi"

export const archiveMessages = async (cookie: string, ids: number[]) => {
  const request = async () => {
    return axios({
      method: "post",
      url: "https://privatemessages.roblox.com//v1/messages/archive",
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`,
        "x-csrf-token": csrf,
        "Content-Type": "application/json",
      },
      data: {
        messageIds: ids,
      },
    })
      .then(() => {
        archivedCount += ids.length
        return ids.length
      })
      .catch((err) => {
        if (err.response.status === 403) {
          csrf = err.response.headers["x-csrf-token"]
          console.log(chalk.yellow(`Set new CSRF token: ${csrf}`))
          return csrf
        } else {
          console.error(err)
        }
      })
  }
  const response = await request()
  return response === csrf ? await request() : response
}
