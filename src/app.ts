require('dotenv').config()
import fastify from 'fastify'
import axios from 'axios'

const { TOKEN, SERVER_URL, PORT } = process.env
const URI = `/webhook/${TOKEN}`
console.log(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${SERVER_URL}${URI}`)
const app = fastify()

app.post(URI, async (req: any, res: any) => {
    console.log(req.body)
    return res.send()
})

async function bot_init() {
    const res = await axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${SERVER_URL}${URI}`)
    console.log(res.data)
}

app.listen(PORT || 5000, async (error, address) => {
    if (error) {
        console.log(error)
        process.exit(1)
    }

    console.log(`Server listening at ${address}`)
    await bot_init()
})
