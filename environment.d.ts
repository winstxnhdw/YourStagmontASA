declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            SERVER_URL: string
            PORT: string
        }
    }
}

export {}
