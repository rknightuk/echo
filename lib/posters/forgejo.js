const createPost = async(formatted, config) => {
    const url = `https://${config.siteUrl}/api/v1/repos/${config.repo}/contents/${formatted.filePath}`
    const fileContent = formatted.content

    let payload = {
        message: formatted.commit || 'New post',
        content: Buffer.from(fileContent).toString('base64'),
        committer: config.committer,
    }

    if (config.branch) {
        payload.branch = config.branch
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${config.token}`
        },
        body: JSON.stringify(payload)
    }

    // console.log(url, options)
    const res = await fetch(url, options)

    return res.json()
}

export default async (config, formatted, site) => {
    const res = await createPost(formatted, config)
    if (res.commit) {
      console.log(`⭐ Created post! ${res.content.url}`)
      console.log(`${res.commit.html_url}`)
    } else {
      console.error(res)
    }
}
