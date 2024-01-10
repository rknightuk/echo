import TurndownService from 'turndown'
import * as Cheerio from 'cheerio'
import { convert } from 'html-to-text'
import { v4 as uuidv4 } from 'uuid'
import urlRegex from 'url-regex'
import { countableText } from './mastodonCount/counter.js'
import { encode, decode } from 'html-entities'

const turndownForWhat = new TurndownService()

export default {
    toMarkdown: (html) => {
        return turndownForWhat.turndown(html)
    },
    cheerioLoad: (html) => {
        return Cheerio.load(html)
    },
    generateUuid: () => {
        return uuidv4()
    },
    htmlToText: (html) => {
        return convert(html, {
            selectors:
            [
                {
                    selector: 'a',
                    options: {
                        ignoreHref: true

                    }
                }
            ]
        })
    },
    getMastodonLength: (string) => {
        return countableText(string).length
    },
    getLinks: (string) => {
        return string.match(urlRegex())
    },
    decode: (string) => {
        return decode(string)
    },
    encode: (string) => {
        return encode(string)
    }
}
