import microblog from './microblog.js'
import webhook from './webhook.js'

export const SERVICES = {
    MICROBLOG: 'mb',
    WEBHOOK: 'hook',
}

export default {
    [SERVICES.MICROBLOG]: microblog,
    [SERVICES.WEBHOOK]: webhook,
}
