import microblog from './microblog.js'
import webhook from './webhook.js'
import mastodon from './mastodon.js'
import omnivore from './omnivore.js'
import github from './github.js'

export const SERVICES = {
    MICROBLOG: 'mb',
    WEBHOOK: 'hook',
    MASTODON: 'masto',
    OMNIVORE: 'omnivore',
    GITHUB: 'github',
}

export default {
    [SERVICES.MICROBLOG]: microblog,
    [SERVICES.WEBHOOK]: webhook,
    [SERVICES.MASTODON]: mastodon,
    [SERVICES.OMNIVORE]: omnivore,
    [SERVICES.GITHUB]: github,
}
