import 'dotenv/config'

export const TOKEN = process.env.TOKEN
export const SERVER_URL = process.env.SERVER_URL
export const PORT = process.env.PORT
export const URI = `/webhook/${TOKEN}`
