const ESStore = window.localStorage

const ES_STORE_KEY = {
  APP: {
    SOURCES: 'app.sources',
    MENU: 'app.menu',
  },
}

export function getStoreSource() {
  console.log('locaslh', ESStore.getItem(ES_STORE_KEY.APP.SOURCES))
  return JSON.parse(ESStore.getItem(ES_STORE_KEY.APP.SOURCES) || '{}')
}

export function setStoreSource(source: any) {
  ESStore.setItem(ES_STORE_KEY.APP.SOURCES, JSON.stringify(source))
}

export function getStoreMenu() {
  return JSON.parse(ESStore.getItem(ES_STORE_KEY.APP.MENU) || '{}')
}

export function setStoreMenu(menu: any) {
  ESStore.setItem(ES_STORE_KEY.APP.MENU, JSON.stringify(menu))
}
