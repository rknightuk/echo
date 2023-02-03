import helpers from '../helpers.js'

const createPost = async(content, config) => {
    const formData = new FormData()
    formData.append('status', content)
    formData.append('visibility', config.visibility || 'public')
    formData.append('sensitive', config.sensitive || false)

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
    const categories = (site.categories || []).map(c => `#${c}`).join(' ')
    let strippedContent = formatted.content.replace(/<[^>]*>/g, '').replace(/\n\n/g, "\n").replace(/\n/g, " ")

    const $ = helpers.cheerioLoad(formatted.content)
    const firstLink = $('a:first').attr('href')

    strippedContent = `${strippedContent} ${firstLink} ${categories}`

    const res = await createPost(strippedContent, config)

    console.log(`⭐ Created post at ${res.url}!`)
}
