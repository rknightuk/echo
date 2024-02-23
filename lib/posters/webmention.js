import { exec } from 'child_process'

export default async (config, formatted, site) => {
    exec(`npx webmention ${formatted.content} --send`)

    console.log('🗣️ Webmentions sent!')
}
