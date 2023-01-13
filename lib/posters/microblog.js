const createPost = async(path, config) => {
    const res = await fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
        })

    return res.json()
}

export default async (config, formatted, site) => {
    const categories = (site.categories || []).map(c => `&category[]=${c}`).join('')

    let path = 'https://micro.blog/micropub' +
        '?h=entry' +
        `&mp-destination=${config.siteUrl}` +
        `&content=${encodeURIComponent(formatted.content)}` +
        `&published=${formatted.date}` +
        categories

        if (formatted.title)
        {
            path += `&name=${formatted.title}`
        }

        const res = await createPost(path, config)

        console.log(`⭐ Created post at ${res.url}!`)
}
