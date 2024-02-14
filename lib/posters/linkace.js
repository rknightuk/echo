const createLink = async(formatted, config, site) => {
    let tags = site.categories || []
    if (formatted.tags) {
        tags = tags.concat(formatted.tags)
    }
    const res = await fetch(`${config.domain}/api/v1/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            url: formatted.content,
            tags: tags.join(','),
        })
    })

    return res.json()
}

export default async (config, formatted, site) => {
    await createLink(formatted, config, site)

    console.log(`⭐ Created link!`)
}