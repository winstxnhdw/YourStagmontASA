import { Telegraf, Context, Scenes, session } from 'telegraf'
import { TOKEN, SERVER_URL, URI } from '../config/environment'
import login from './scenes/login'
import { start, help, other } from './handlers'

export default class TelegramBot {
    public tg: Telegraf<Context>
    private stage: any

    constructor() {
        this.tg = new Telegraf(TOKEN)
        this.tg.telegram.setWebhook(`${SERVER_URL}${URI}`)

        this.stage = new Scenes.Stage([login])
    }

    public async init() {
        this.tg.use(session())
        this.tg.use(this.stage.middleware())
        this.tg.start(start)
        this.tg.help(help)
        this.tg.on('message', other)
    }
}
