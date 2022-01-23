import { TOKEN, SERVER_URL, URI } from '../config/environment'
import { Telegraf } from 'telegraf'
import { start, help } from './handlers'

export default class TelegramBot {
    tg: any
    constructor() {
        this.tg = new Telegraf(TOKEN)
        this.tg.telegram.setWebhook(`${SERVER_URL}${URI}`)
    }

    async init() {
        this.tg.start(start)
        this.tg.help(help)
    }
}
