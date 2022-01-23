import { TOKEN, SERVER_URL, URI } from '../config/environment'
import { Telegraf } from 'telegraf'
import { start, help, other } from './handlers'

export default class TelegramBot {
    public tg: any

    constructor() {
        this.tg = new Telegraf(TOKEN)
        this.tg.telegram.setWebhook(`${SERVER_URL}${URI}`)
    }

    public async init() {
        this.tg.start(start)
        this.tg.help(help)
        this.tg.on('message', other)
    }
}
