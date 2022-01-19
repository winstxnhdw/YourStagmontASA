import 'dotenv/config'
import axios from 'axios'

export default class TelegramBot {
    api: string
    webhook_url: string

    constructor(environment_variables: NodeJS.ProcessEnv) {
        const token = environment_variables.TOKEN
        const server_url = environment_variables.SERVER_URL
        const uri = `/webhook/${token}`

        this.api = `https://api.telegram.org/bot${token}`
        this.webhook_url = `${server_url}${uri}`
    }

    async init() {
        const res = await axios.get(`${this.api}/setWebhook?url=${this.webhook_url}`)
        console.log(res.data)
    }
}
