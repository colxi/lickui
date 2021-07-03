import Logger from '@/lib/logger'

export const LoggerConfigs = {
  serviceEvent: {
    context: {
      background: Logger.hexColor('#FFFFFF'),
      color: Logger.hexColor('#333333'),
      padding: 1,
      text: '⚡︎ EVENT'
    }
  },
  socket: {
    context: {
      background: Logger.hexColor('#333333'),
      color: Logger.hexColor('#BB66AA'),
      padding: 1,
      text: '␥ Socket'
    }
  },
  binanceClient: {
    renderTime: false,
    context: {
      background: Logger.hexColor('#f59542'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'BinanceClient'
    }
  },
  // FUTURES WALLET SERVICE
  futuresWalletService: {
    context: {
      background: Logger.hexColor('#ebb359'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'FuturesWalletService'
    }
  },
  futuresWalletServiceSocketManager: {
    context: {
      background: Logger.hexColor('#e0c182'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'SocketManager'
    }
  },
  // FUTURES ASSET SERVICE
  futuresAssetService: {
    context: {
      background: Logger.hexColor('#ddd322'),
      color: Logger.hexColor('#666666'),
      padding: 1,
      text: 'FuturesAssetsService'
    }
  },
  futuresAssetServiceSocketManager: {
    context: {
      background: Logger.hexColor('#eee359'),
      color: Logger.hexColor('#666666'),
      padding: 1,
      text: 'SocketManager'
    }
  }
}

