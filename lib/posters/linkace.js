const createLink = async(formatted, config, site) => {
    let tags = site.categories || []
    if (formatted.tags) {
        tags = tags.concat(formatted.tags)
    }

    const data = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            url: formatted.content,
            tags: tags.join(','),
        })
    }
    
    const res = await fetch(`${config.domain}/api/v1/links`, data)

    return res.json()
}

export default async (config, formatted, site) => {
    await createLink(formatted, config, site)

    console.log(`⭐ Created link!`)
}