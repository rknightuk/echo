import helpers from '../helpers.js'

export default async (config, formatted, site) => {
    const res = await fetch('https://api-prod.omnivore.app/api/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': config.apiKey,
            },
            body: JSON.stringify({
                'query': 'mutation SaveUrl($input: SaveUrlInput!) { saveUrl(input: $input) { ... on SaveSuccess { url clientRequestId } ... on SaveError { errorCodes message } } }',
                'variables': {
                    'input': {
                        'clientRequestId': helpers.generateUuid(),
                        'source': 'api',
                        'url': formatted.url,
                    }
                }
            })
        })

    console.log('🔖 Saved to Omnivore!')
}
