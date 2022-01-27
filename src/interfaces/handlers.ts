import { Markup, Context } from 'telegraf'
import { messages } from './messages'

export const start = async (ctx: Context) => {
    const options = Markup.inlineKeyboard([Markup.button.callback('Login', 'login')])
    ctx.reply(messages.start(ctx.from!.first_name), options)
}

export const help = async (ctx: Context) => {
    ctx.reply(messages.help)
}

export const other = async (ctx: Context) => {
    ctx.reply(messages.other)
}
