const createPost = async(formatted, config) => {
    const url = `https://api.github.com/repos/${config.repo}/contents/${formatted.filePath}`
    const fileContent = formatted.content

    const payload = {
        message: formatted.commit || 'New post',
        content: Buffer.from(fileContent).toString('base64'),
        committer: config.committer,
    }

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/vnd.github.v3+json',
            Authorization: `token ${config.token}`
        },
        body: JSON.stringify(payload)
    }

    const res = await fetch(url, options)

    return res.json()
}

export default async (config, formatted, site) => {
    await createPost(formatted, config)

    console.log(`⭐ Created post!`)
}