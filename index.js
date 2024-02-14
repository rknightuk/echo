import fs from 'fs'
import RSSParser from 'rss-parser'
import posters from './lib/posters/index.js'

const echoPath = process.argv[1].replace('index.js', '')

import config from './config.js'

const args = process.argv.slice(2)
const INIT_MODE = args.includes('init')
const DRY_MODE = args.includes('dry')

if (DRY_MODE && INIT_MODE)
{
    console.log('🚨 You cannot run Echo with init mode AND dry mode enabled at the same time')
    process.exit()
}

if (DRY_MODE) console.log('🌵 Running in dry mode, no posts will be created')

async function getFeedItems(feed, isJson, customFields)
{
    if (isJson)
    {
        const res = await fetch(feed)
        const feedData = await res.json()
        return feedData.items
    }

    const data = await (new RSSParser({
        customFields: {
            item: customFields || [],
        }
    })).parseURL(feed)
    return data.items || []
}

if (!fs.existsSync(`${echoPath}data`)) {
    fs.mkdirSync(`${echoPath}data`)
    console.log('📁 Data folder created!')
}

for (const site of config.sites)
{
    const siteFile = `${site.name}.txt`
    if (!fs.existsSync(`${echoPath}data/${siteFile}`)) {
        await fs.writeFile(`${echoPath}data/${siteFile}`, JSON.stringify([], '', 2), { flag: "wx" }, (err) => {
            if (err) throw err;
            console.log(`✅ ${site.name} data file created!`)
        })
    }

    console.log(`⚙️ Fetching for ${site.name}`)
    let items = await getFeedItems(site.feed, site.json, site.customFields)

    if (items.length === 0)
    {
        console.log(`0️⃣ No items found for ${site.name}`)
        continue;
    }

    if (!site.transform.getId(items[0]))
    {
        console.log(`❌ No ID found for item in ${site.name}, skipping`)
        console.log(`👀 To fix this, check the transform.getId function for this site. It's likely you're expecting id but the feed item uses guid instead`)
        break;
    }

    if (site.transform.filter)
    {
        items = site.transform.filter(items)
    }
    const existingIds = JSON.parse(fs.readFileSync(`${echoPath}data/${siteFile}`, 'utf8'))

    if (existingIds.length > 0) {
        items = items.filter(item => {
            return !existingIds.includes(site.transform.getId(item))
        })
    }

    if (!items.length && !INIT_MODE)
    {
        console.log(`❎ No new items found for ${site.name}`)
        continue
    }

    const newIds = items.map(i => site.transform.getId(i))

    if (!DRY_MODE)
    {
        fs.writeFileSync(`${echoPath}data/${siteFile}`, JSON.stringify([...newIds, ...existingIds], '', 2));
    }

    if (INIT_MODE)
    {
        console.log(`⚙️ Echo initialised for ${site.name}!`)
        continue
    }

    for (const item of items)
    {
        const formatted = site.transform.format(item)

        if (DRY_MODE)
        {
            console.log(`✅ Will create ${site.name} post for ${formatted.date}\n\n${formatted.content}`)
        } else {
            for (const service of site.services)
            {
                await posters[service](config.services[service], formatted, site)
            }
        }
    }
}

process.exit()
