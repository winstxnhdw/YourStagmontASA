const start_msg = (name: string) => {
    const msg = `
Hello ${name}! I am your personal Stagmont Admin Support Assistant in the form of a Telegram bot.
My current duties are to mark parade states as efficiently as possible!

You can send /login to begin the process. If at any point in time you feel lost, you can always send /help to get some help.

Created by @winsstooon
`
    return msg
}

export const help_msg = `
If you are an Admin Support Assistant from Stagmont camp, I can assist you with marking parade states!

You can control me by sending these commands:

/start - start the bot
`

export const other_msg = `
I am sorry, I don't understand that command. Remember that you can always send /help to get some help.
`

export module messages {
    export const start = start_msg
    export const help = help_msg
    export const other = other_msg
}
