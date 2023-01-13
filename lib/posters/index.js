import microblog from './microblog.js'
import webhook from './webhook.js'
import mastodon from './mastodon.js'

export const SERVICES = {
    MICROBLOG: 'mb',
    WEBHOOK: 'hook',
    MASTODON: 'masto',
}

export default {
    [SERVICES.MICROBLOG]: microblog,
    [SERVICES.WEBHOOK]: webhook,
    [SERVICES.MASTODON]: mastodon,
}
