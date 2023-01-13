import TurndownService from 'turndown'
import Cheerio from 'cheerio'

const turndownForWhat = new TurndownService()

export default {
    toMarkdown: (html) => {
        return turndownForWhat.turndown(html)
    },
    cheerioLoad: (html) => {
        return Cheerio.load(html)
    },
}
