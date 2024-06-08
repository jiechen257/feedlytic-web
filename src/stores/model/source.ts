import { fetchFavicon, parseRSS } from '@/utils'
import { FeedData } from '@extractus/feed-extractor'
import { RSSItem } from './item'
import { getStoreSource, setStoreSource } from '../electron-store'

export class RSSSource {
  sid: number | undefined

  url: string

  iconUrl?: string

  name: string

  unreadCount: number | undefined

  lastFetched: Date

  fetchFrequency: number // in minutes

  textGroup: string

  hiddenStatus: number

  items: Array<RSSItem> | []

  constructor(url: string, name: string = '') {
    this.url = url
    this.name = name
    this.lastFetched = new Date()
    this.fetchFrequency = 0
    this.hiddenStatus = -1
    this.items = []
    this.textGroup = '未分类'
  }

  static async fetchMetaData(source: RSSSource) {
    const feed = await parseRSS(source.url)
    if (feed && !source.name) {
      if (feed.title) source.name = feed.title.trim()
      source.name = source.name || '未命名'
    }
    return feed
  }
}

export function insertSource(source: RSSSource) {
  return new Promise((resolve, reject) => {
    const sources = getStoreSource() || []
    if (sources.length) {
      const sids = Object.values(sources)?.map((s) => s.sid) || -1
      source.sid = Math.max(...sids, -1) + 1
    } else {
      source.sid = 0
    }
    try {
      resolve(source)
    } catch (err) {
      reject(err)
    }
  })
}

export async function getInsertionSource(url: string, name: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const source = new RSSSource(url, name)
  const feed = (await RSSSource.fetchMetaData(source)) as FeedData
  source.items = feed.entries?.map((v) => new RSSItem(v)) || []
  source.unreadCount = feed.entries?.length
  source.iconUrl = ''
  const inserted = await insertSource(source)
  return inserted
}

export async function addSourceHelper(
  store: { set: Function; get: Function },
  url: string,
  name: string,
) {
  const { set, get } = store
  const { sourceInit } = get()
  if (!sourceInit) {
    throw new Error('Source not initialized')
  }
  let linkList
  if (getStoreSource().length) {
    linkList = getStoreSource()?.map((v) => v.link) || []
  }
  if (linkList.includes(url)) {
    throw new Error('Source already exists')
  }
  const inserted = await getInsertionSource(url, name)
  if (inserted) {
    set({
      sources: [...(get().sources || []), inserted],
    })
    setStoreSource(get().sources)
    console.log('app.sources', get().sources)
  }
}
