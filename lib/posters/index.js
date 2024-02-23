import microblog from './microblog.js'
import webhook from './webhook.js'
import mastodon from './mastodon.js'
import omnivore from './omnivore.js'
import github from './github.js'
import linkace from './linkace.js'
import webmention from './webmention.js'

export const SERVICES = {
    MICROBLOG: 'mb',
    WEBHOOK: 'hook',
    MASTODON: 'masto',
    OMNIVORE: 'omnivore',
    GITHUB: 'github',
    LINKACE: 'linkace',
    WEBMENTION: 'webmention',
}

export default {
    [SERVICES.MICROBLOG]: microblog,
    [SERVICES.WEBHOOK]: webhook,
    [SERVICES.MASTODON]: mastodon,
    [SERVICES.OMNIVORE]: omnivore,
    [SERVICES.GITHUB]: github,
    [SERVICES.LINKACE]: linkace,
    [SERVICES.WEBMENTION]: webmention,
}
