import 'dotenv/config'
import puppeteer from 'puppeteer'

interface StringDict {
    [key: string]: string
}

export default class CompanionAgent {
    private browser: any
    private page: any

    public parade_state_url: string
    public names_dict: StringDict
    public completed: boolean

    private readonly user_agent: string
    private readonly period_id_dict: StringDict

    constructor() {
        this.browser = null
        this.page = null
        this.parade_state_url = ''
        this.names_dict = {}
        this.completed = false

        this.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0'
        this.period_id_dict = {
            'First Parade': '18',
            'Mid-Day Parade': '19'
        }
    }

    public async init() {
        this.browser = await puppeteer.launch({ headless: false })
        this.page = await this.browser.newPage()
        await this.page.setUserAgent(this.user_agent)

        console.log('New tab opened')
    }

    public async login(username: string, password: string) {
        if (this.page === null) {
            console.log('Page not initialised')
        }

        await this.page.goto('https://i-zone.mobi/Companion/Login.aspx')
        await this.page.type('#WebPatterns_wt17_block_wtUsername_wtUserNameInput', username)
        await this.page.type('#WebPatterns_wt17_block_wtPassword_wtPasswordInput', password)
        await this.page.click('#WebPatterns_wt17_block_wtAction_wtLoginButton')
        await this.page.waitForSelector('#wt11_wtTitle')

        console.log(`Logged in as ${username}`)
    }

    public async get_parade_state() {
        await this.page.goto('https://i-zone.mobi/InfoOntheGo/ParadeStateMarker.aspx')
        await this.wait_click('#Comp_Common_UI_wt2_block_wtMainContent_WebPatterns_wt16_block_wtContent_wtGetParadeStatesList_ctl00_wt15_wt1')
        await this.page.waitForSelector('#Comp_Common_UI_wt9_block_wtTitle')

        this.parade_state_url = this.page.url()

        for (let period_id = 18; period_id <= 21; period_id++) {
            await this.page.goto(`${this.parade_state_url.slice(0, -2)}${period_id}`)
            await this.page.waitForSelector('#Comp_Common_UI_wt9_block_wtTitle')

            const names = await this.page.$$eval('span.Title.Bold', (els: any) => els.map((el: any) => el.innerHTML))

            const user_details_urls = await this.page.$$eval('a', (els: any) =>
                els.map((el: any) => el.href).filter((url: string) => url.includes('ParadeStateUserDetails.aspx?WasAO='))
            )

            if (user_details_urls.length === 0) {
                continue
            }

            names.forEach((name: string, idx: number) => {
                const user_url = user_details_urls[idx]
                const pattern = 'StateId='
                const start_id = user_url.indexOf(pattern) + pattern.length
                this.names_dict[name] = user_url.slice(start_id, start_id + 7)
            })

            console.log('Parade state information retrieved')
            console.log(`Total strength: ${names.length}`)
            break
        }
    }

    public async set_parade_state(absentees_dict: StringDict) {
        this.page.on('dialog', async (dialog: any) => {
            await dialog.accept()
        })

        if (!(Object.keys(absentees_dict).length === 0)) {
            for (let absentee in absentees_dict) {
                await this.set_absent(absentee, absentees_dict[absentee])
            }
        }

        for (let period in this.period_id_dict) {
            const parade_url = `${this.parade_state_url.slice(0, -2)}${this.period_id_dict[period]}`
            const submitted = await this.set_all_present(parade_url, period)

            if (submitted === false) {
                await this.submit_parade_state(parade_url, period)
            }
        }

        this.completed = true
    }

    public async check_parade_state_status() {
        let image_buffer = []

        for (let period in this.period_id_dict) {
            const parade_url = `${this.parade_state_url.slice(0, -2)}${this.period_id_dict[period]}`
            await this.page.goto(parade_url)
            image_buffer.push(await this.page.screenshot({ type: 'jpeg', quality: 100, fullPage: true }))
        }

        return image_buffer
    }

    private async set_absent(name: string, remarks: string) {
        await this.page.goto(`https://i-zone.mobi/InfoOntheGo/ParadeStateUserDetails.aspx?WasAO=False&ParadeStateId=${this.names_dict[name]}`)
        await this.wait_click('#Comp_Common_UI_wt3_block_wtMainContent_WebPatterns_wt5_block_wtContent_wtParadeStateStatusList_ctl28_wtModule')

        await this.page.waitForTimeout(500)
        const remark_field_selector = '#Comp_Common_UI_wt3_block_wtMainContent_wtParadeStateAbsentee_Remarks'
        await this.page.$eval(remark_field_selector, (el: HTMLInputElement) => (el.value = ''))
        await this.page.type(remark_field_selector, remarks)

        await this.wait_click('#Comp_Common_UI_wt3_block_wtMainContent_wtParadeState_SetSubsequent')
        await this.wait_click('#Comp_Common_UI_wt3_block_wtMainContent_wtBtnApplyReason2')
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' })

        console.log(`Setting ${name} as 'Absent'`)
        console.log(`Reason: ${remarks}`)
    }

    private async set_all_present(parade_url: string, period: string) {
        await this.page.goto(parade_url)
        const present_btn_selector = '#Comp_Common_UI_wt9_block_wtMainContent_wtParadeStateUserList_wt46'

        if ((await this.page.$(present_btn_selector)) === null) {
            console.log(`${period} state has already been submitted`)
            return true
        }

        await this.page.click(present_btn_selector)
        console.log(`Setting all to present for ${period}`)
        return false
    }

    private async submit_parade_state(parade_url: string, period: string) {
        await this.page.goto(parade_url)
        await this.wait_click('#Comp_Common_UI_wt9_block_wtActions_wtbtnSubmit')
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' })

        console.log(`${period} state submitted`)
    }

    private async wait_click(selector: string) {
        await this.page.waitForSelector(selector)
        await this.page.click(selector)
    }
}

async function test() {
    const agent = new CompanionAgent()

    const absentee_dict = {
        'REC ALPHONSUS CHUA YI CHEN': 'Cohorting',
        'REC WINSTON HO DI WEI': 'MC'
    }

    await agent.init()
    await agent.login(<string>process.env.USERNAME, <string>process.env.PASSWORD)
    await agent.get_parade_state()
    await agent.set_parade_state(absentee_dict)
    await agent.browser.close()
    console.log('Test sucessfully completed')
}

test()
