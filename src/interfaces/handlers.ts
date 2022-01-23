import { messages } from './messages'

export const start = async (ctx: any) => {
    ctx.reply(messages.start)
}

export const help = async (ctx: any) => {
    ctx.reply(messages.help)
}

export const other = async (ctx: any) => {
    ctx.reply(messages.other)
}
