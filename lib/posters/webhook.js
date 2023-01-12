export default async (config, formatted, site) => {
    const res = await fetch(config.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formatted)
        })

    console.log('🗣️ Webhook posted!')
}
