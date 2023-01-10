import helpers from './lib/helpers.js'
import presets from './lib/presets.js'

export default {
    // https://mycoolname.micro.blog
    siteUrl: '',
    // get an API from https://micro.blog/account/apps
    apiKey: '',
    sites: [
        {
            name: "example.com",
            feed: "http://example.com/feed",
            categories: ["my category"],
            transform: presets.default,
        }
    ]
}
