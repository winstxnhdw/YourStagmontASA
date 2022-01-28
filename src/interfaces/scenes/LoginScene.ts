import { Context, Composer, Scenes } from 'telegraf'

interface LoginSession extends Scenes.WizardSessionData {
    username: string
    password: string
}

interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext, LoginSession>
    wizard: Scenes.WizardContextWizard<MyContext>
}

const leave_scene = (ctx: Scenes.WizardContext) => {
    ctx.reply('You have cancelled the login process.')
    return ctx.scene.leave()
}

const ask_username_step = (ctx: any) => {
    ctx.reply('Enter your username:')
    return ctx.wizard.next()
}

const get_username_step = new Composer<MyContext>()

get_username_step.on('text', async (ctx) => {
    const message = ctx.message.text
    ctx.scene.session.username = message
    await ctx.reply(`Username: ${message}\nEnter your password:`)

    return ctx.wizard.next()
})

const get_password_step = new Composer<MyContext>()

get_password_step.on('text', async (ctx) => {
    ctx.scene.session.password = ctx.message.text
    await ctx.reply(`I have received your password. Logging in..`)
    return ctx.wizard.selectStep(ctx.wizard.cursor)
})

get_username_step.command('cancel', (ctx: any) => leave_scene(ctx))
get_password_step.command('cancel', (ctx: any) => leave_scene(ctx))

export const login_scene = new Scenes.WizardScene('login_scene', ask_username_step, get_username_step, get_password_step)
