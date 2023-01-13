import helpers from './lib/helpers.js'
import presets from './lib/presets.js'
import { SERVICES } from './lib/posters/index.js'

export default {
    services: {
        [SERVICES.MICROBLOG]: {
            siteUrl: '', // https://mycoolname.micro.blog
            apiKey: '', // get an API from https://micro.blog/account/apps
        }
    },
    sites: [
        {
            name: "example.com",
            feed: "http://example.com/feed",
            categories: ["my category"],
            transform: presets.default,
            services: [SERVICES.MICROBLOG]
        }
    ]
}
