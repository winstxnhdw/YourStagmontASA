import 'dotenv/config'
import fastify from 'fastify'
import TelegramBot from './interfaces/app'

const { TOKEN, PORT } = process.env
const URI = `/webhook/${TOKEN}`

const server = fastify({
    logger: false
})

const bot = new TelegramBot(process.env)

server.post(URI, async (req: any, res: any) => {
    const chat_id = req.body.message.chat.id
    const text = req.body.message.text

    return res.send()
})

server.listen(PORT || 5000, '127.0.0.1', async (error, address) => {
    if (error) {
        console.log(error)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
    await bot.init()
})
