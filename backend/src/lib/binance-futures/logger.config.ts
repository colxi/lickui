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
  binanceFutures: {
    renderTime: false,
    context: {
      background: Logger.hexColor('#f59542'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'BinanceFutures'
    }
  },
  // FUTURES API SERVICE
  futuresApiService: {
    context: {
      background: Logger.hexColor('#eb33ff'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'FuturesApiService'
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
  },
  // FUTURES LIQUIDATIONS SERVICE
  futuresLiquidationsService: {
    context: {
      background: Logger.hexColor('#4ea359'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'FuturesLiquidationService'
    }
  },
  futuresLiquidationsServiceSocketManager: {
    context: {
      background: Logger.hexColor('#6eb390'),
      color: Logger.hexColor('#666666'),
      padding: 1,
      text: 'SocketManager'
    }
  },
  // FUTURES POSITIONs SERVICE
  futuresPositionsService: {
    context: {
      background: Logger.hexColor('#2e83aa'),
      color: Logger.hexColor('#FFFFFF'),
      padding: 1,
      text: 'FuturesPositionsService'
    }
  },
  futuresPositionsServiceSocketManager: {
    context: {
      background: Logger.hexColor('#5ea3da'),
      color: Logger.hexColor('#666666'),
      padding: 1,
      text: 'SocketManager'
    }
  }
}

