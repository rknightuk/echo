export default {
    default: {
        getId: (data) => {
            return data.id
        },
        format: (data) => {
            return {
                content: data.content,
                date: data.isoDate,
            }
        }
    },
    statuslol: {
        getId: (data) => {
            return data.id
        },
        format: (data) => {
            return {
                content: data.contentSnippet,
                date: data.isoDate,
            }
        }
    },
    letterboxd: {
        getId: (data) => {
            return data.guid
        },
        format: (data) => {
            let content = data.content.trim()
            content = `${data.title}

            ${content}`
            return {
                content: content.trim(),
                date: new Date(data.isoDate).toISOString(),
            }
        }
    },
    letterboxdNoPoster: {
        getId: (data) => {
            return data.guid
        },
        format: (data) => {
            let content = data.content.trim()
            // remove movie poster from content
            if (data.content.includes('img src='))
            {
                content = content.replace(content.match(/(<p>.*?<\/p>)/g)[0], '')
            }
            content = `${data.title}

            ${content}`
            return {
                content: content,
                date: new Date(data.isoDate).toISOString(),
            }
        }
    },
}
