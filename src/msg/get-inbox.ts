import axios from "axios"

export const getInboxPage = async (cookie: string, page: number) => {
  return axios({
    method: "get",
    url: `https://privatemessages.roblox.com/v1/messages?messageTab=inbox&pageNumber=${page}&pageSize=100&messageTab=Inbox`,
    headers: {
      Cookie: `.ROBLOSECURITY=${cookie}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return {
        Collection: res.data.collection,
        Page: res.data.pageNumber,
      }
    })
    .catch((err) => {
      if (err.response.status === 500) {
        console.error("Sending too many requests!")
      } else {
        console.error(err)
      }
    })
}
