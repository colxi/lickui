export default {
  binance: {
    production: {
      spotAPI: 'https://api.binance.com/api',
      futuresAPI: 'https://fapi.binance.com/fapi/',
      spotWS: 'wss://stream.binance.com:9443/ws',
      futuresWS: 'wss://fstream.binance.com/ws'
    },
    testnet: {
      spotAPI: '',
      futuresAPI: '',
      spotWS: '',
      futuresWS: ''
    },
  },
  updateIntervalInMillis: 20000,
  databaseName: 'lickHunterDb',
  apiServicePort: 3300,
  httpServicePort: 8888,
  httpServiceIp: 'localhost',
  futuresQuoteAsset: 'USDT',
  futuresLeverage: 5, // 0-125
  futuresMarginType: 'ISOLATED', // ISOLATED or CROSSED,
  setLeverageOnBoot: false,
  setMarginTypeOnBoot: false,
  takeProfit: 0.3,
  maxPositions: 1,
  coins: {
    '1000SHIB': {
      asset: '1000SHIB',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 3,
      enabled: false
    },
    '1INCH': {
      asset: '1INCH',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'AAVE': {
      asset: 'AAVE',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: true
    },
    'ADA': {
      asset: 'ADA',
      longOffset: 5,
      shortOffset: 5,
      lickValue: 7,
      enabled: false
    },
    'AKRO': {
      asset: 'AKRO',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ALGO': {
      asset: 'ALGO',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ALICE': {
      asset: 'ALICE',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 4,
      enabled: false
    },
    'ALPHA': {
      asset: 'ALPHA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ANKR': {
      asset: 'ANKR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ATOM': {
      asset: 'ATOM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 6,
      enabled: true
    },
    'AVAX': {
      asset: 'AVAX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 3,
      enabled: false
    },
    'AXS': {
      asset: 'AXS',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BAKE': {
      asset: 'BAKE',
      longOffset: '2.0',
      shortOffset: '2.0',
      lickValue: 2,
      enabled: false
    },
    'BAL': {
      asset: 'BAL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BAND': {
      asset: 'BAND',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'BAT': {
      asset: 'BAT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BCH': {
      asset: 'BCH',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'BEL': {
      asset: 'BEL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BLZ': {
      asset: 'BLZ',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BNB': {
      asset: 'BNB',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 4,
      enabled: false
    },
    'BTC': {
      asset: 'BTC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: false
    },
    'BTCST': {
      asset: 'BTCST',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BTS': {
      asset: 'BTS',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 6,
      enabled: false
    },
    'BTT': {
      asset: 'BTT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'BZRX': {
      asset: 'BZRX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 2,
      enabled: true
    },
    'CELR': {
      asset: 'CELR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 6,
      enabled: true
    },
    'CHR': {
      asset: 'CHR',
      longOffset: 5,
      shortOffset: 5,
      lickValue: 0,
      enabled: false
    },
    'CHZ': {
      asset: 'CHZ',
      longOffset: 5,
      shortOffset: 5,
      lickValue: 0,
      enabled: false
    },
    'COMP': {
      asset: 'COMP',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'COTI': {
      asset: 'COTI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'CRV': {
      asset: 'CRV',
      longOffset: 5,
      shortOffset: 5,
      lickValue: 3,
      enabled: false
    },
    'CTK': {
      asset: 'CTK',
      longOffset: 5,
      shortOffset: 5,
      lickValue: 0,
      enabled: true
    },
    'CVC': {
      asset: 'CVC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'DASH': {
      asset: 'DASH',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'DEFI': {
      asset: 'DEFI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'DENT': {
      asset: 'DENT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'DGB': {
      asset: 'DGB',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'DODO': {
      asset: 'DODO',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'DOGE': {
      asset: 'DOGE',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'DOT': {
      asset: 'DOT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 9,
      enabled: false
    },
    'EGLD': {
      asset: 'EGLD',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'ENJ': {
      asset: 'ENJ',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 2,
      enabled: false
    },
    'EOS': {
      asset: 'EOS',
      longOffset: 6,
      shortOffset: 6,
      lickValue: 1,
      enabled: false
    },
    'ETC': {
      asset: 'ETC',
      longOffset: 6,
      shortOffset: 6,
      lickValue: 2,
      enabled: false
    },
    'ETH': {
      asset: 'ETH',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'FIL': {
      asset: 'FIL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: true
    },
    'FLM': {
      asset: 'FLM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'FTM': {
      asset: 'FTM',
      longOffset: '4.5',
      shortOffset: '4.5',
      lickValue: 5,
      enabled: false
    },
    'GRT': {
      asset: 'GRT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'HBAR': {
      asset: 'HBAR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 6,
      enabled: false
    },
    'HNT': {
      asset: 'HNT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 3,
      enabled: true
    },
    'HOT': {
      asset: 'HOT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ICP': {
      asset: 'ICP',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 4,
      enabled: false
    },
    'ICX': {
      asset: 'ICX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'IOST': {
      asset: 'IOST',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'IOTA': {
      asset: 'IOTA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: false
    },
    'KAVA': {
      asset: 'KAVA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'KNC': {
      asset: 'KNC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'KSM': {
      asset: 'KSM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 8,
      enabled: false
    },
    'LINA': {
      asset: 'LINA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'LINK': {
      asset: 'LINK',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'LIT': {
      asset: 'LIT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'LRC': {
      asset: 'LRC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 304,
      enabled: true
    },
    'LTC': {
      asset: 'LTC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 170,
      enabled: true
    },
    'LUNA': {
      asset: 'LUNA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'MANA': {
      asset: 'MANA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: false
    },
    'MATIC': {
      asset: 'MATIC',
      longOffset: 8,
      shortOffset: 8,
      lickValue: 5,
      enabled: false
    },
    'MKR': {
      asset: 'MKR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'MTL': {
      asset: 'MTL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: true
    },
    'NEAR': {
      asset: 'NEAR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 2,
      enabled: false
    },
    'NEO': {
      asset: 'NEO',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'NKN': {
      asset: 'NKN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'OCEAN': {
      asset: 'OCEAN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'OGN': {
      asset: 'OGN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: true
    },
    'OMG': {
      asset: 'OMG',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: false
    },
    'ONE': {
      asset: 'ONE',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: true
    },
    'ONT': {
      asset: 'ONT',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'QTUM': {
      asset: 'QTUM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 6,
      enabled: false
    },
    'REEF': {
      asset: 'REEF',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 191,
      enabled: true
    },
    'REN': {
      asset: 'REN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'RLC': {
      asset: 'RLC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'RSR': {
      asset: 'RSR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'RUNE': {
      asset: 'RUNE',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: true
    },
    'RVN': {
      asset: 'RVN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SAND': {
      asset: 'SAND',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SC': {
      asset: 'SC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SFP': {
      asset: 'SFP',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SKL': {
      asset: 'SKL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 170,
      enabled: true
    },
    'SNX': {
      asset: 'SNX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SOL': {
      asset: 'SOL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 8,
      enabled: false
    },
    'SRM': {
      asset: 'SRM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: false
    },
    'STMX': {
      asset: 'STMX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'STORJ': {
      asset: 'STORJ',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'SUSHI': {
      asset: 'SUSHI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 8,
      enabled: true
    },
    'SXP': {
      asset: 'SXP',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'THETA': {
      asset: 'THETA',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: false
    },
    'TOMO': {
      asset: 'TOMO',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'TRB': {
      asset: 'TRB',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 1,
      enabled: true
    },
    'TRX': {
      asset: 'TRX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'UNFI': {
      asset: 'UNFI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'UNI': {
      asset: 'UNI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 2,
      enabled: false
    },
    'VET': {
      asset: 'VET',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 9,
      enabled: false
    },
    'WAVES': {
      asset: 'WAVES',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 3,
      enabled: false
    },
    'XEM': {
      asset: 'XEM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'XLM': {
      asset: 'XLM',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: true
    },
    'XMR': {
      asset: 'XMR',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 5,
      enabled: false
    },
    'XRP': {
      asset: 'XRP',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'XTZ': {
      asset: 'XTZ',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 9,
      enabled: false
    },
    'YFI': {
      asset: 'YFI',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'YFII': {
      asset: 'YFII',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ZEC': {
      asset: 'ZEC',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 7,
      enabled: false
    },
    'ZEN': {
      asset: 'ZEN',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 2,
      enabled: false
    },
    'ZIL': {
      asset: 'ZIL',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    },
    'ZRX': {
      asset: 'ZRX',
      longOffset: 4,
      shortOffset: 4,
      lickValue: 0,
      enabled: false
    }
  }
}
