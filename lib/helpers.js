import TurndownService from 'turndown'
import * as Cheerio from 'cheerio'
import { convert } from 'html-to-text'

const turndownForWhat = new TurndownService()

export default {
    toMarkdown: (html) => {
        return turndownForWhat.turndown(html)
    },
    cheerioLoad: (html) => {
        return Cheerio.load(html)
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
}
