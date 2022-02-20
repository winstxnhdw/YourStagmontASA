import { Telegraf, Context, Scenes, session } from 'telegraf'
import { TOKEN, SERVER_URL, URI } from '../config/environment'
import { start, help, other } from './handlers'
import { login_scene } from './scenes/LoginScene'

export default class TelegramBot {
  public tg: Telegraf<Context>
  private stage: any

  constructor() {
    this.tg = new Telegraf(TOKEN)
    this.tg.telegram.setWebhook(`${SERVER_URL}${URI}`)

    this.stage = new Scenes.Stage([login_scene])
  }

  public async init() {
    this.tg.use(session())
    this.tg.use(this.stage.middleware())

    this.tg.start(start)
    this.tg.help(help)
    this.tg.on('message', other)
    this.tg.action('login', async (ctx: any) => {
      ctx.scene.enter('login_scene')
    })
  }
}
