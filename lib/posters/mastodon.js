import helpers from '../helpers.js'

const createPost = async(content, config, spoilerText) => {
    const formData = new FormData()
    formData.append('status', content)
    formData.append('visibility', config.visibility || 'public')
    formData.append('sensitive', config.sensitive || false)
    if (spoilerText)
    {
        formData.append('spoiler_text', spoilerText)
    }

    const res = await fetch(`${config.instance}/api/v1/statuses`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${config.accessToken}`
            },
            body: formData
        })

    return res.json()
}

export default async (config, formatted, site) => {
    if (formatted.spoilers)
    {
        config.sensitive = true
    }
    const categories = (site.categories || []).map(c => `#${c}`).join(' ')
    let formattedContent = site.skipConversion ? formatted.content : helpers.htmlToText(formatted.content)
    formattedContent = `${formattedContent} ${categories}`

    const res = await createPost(formattedContent, config, formatted.spoilers)

    console.log(`⭐ Created post at ${res.url}!`)
}
