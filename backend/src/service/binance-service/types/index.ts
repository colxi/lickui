import { ServiceStatus } from '@/lib/evented-service/types'
import { AssetName } from '@/types'

export interface BinanceServiceStartOptions {
  assetPairs: AssetName[]
}

export interface BinanceServiceStatus {
  isActive: boolean
  isBusy: boolean
  services: {
    wallet: {
      status: ServiceStatus
      isSocketConnected: boolean
    },
    liquidations: {
      status: ServiceStatus
      isSocketConnected: boolean
    },
    assets: {
      status: ServiceStatus
      isSocketConnected: boolean
    }
  }
}
