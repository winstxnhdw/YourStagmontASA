import fastify from 'fastify'
import telegrafPlugin from 'fastify-telegraf'
import TelegramBot from './interfaces/bot'
import { PORT, URI } from './config/environment'

const bot = new TelegramBot()

const server = fastify({
    logger: false
})

server.register(telegrafPlugin, { bot: bot.tg, path: URI })

server.listen(PORT || 5000, '127.0.0.1', async (error, address) => {
    if (error) {
        console.log(error)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
    bot.init()
})
