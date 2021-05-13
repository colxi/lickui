# lickui
Lickui is a tiny browser based Binance Futures History explorer, that rexposes several data visualizations useful for tracking trading history and results, and to perform trading strategies performance.

### Features :
- Filtering : last hour, last day, last week, last month...
- AveDaily average profit
- Wallet timeline balance
- Open orders timeline
- Used Balance percentage timeline
- Unrealized Losts percentage timeline
- Coinbase alerts (new coin additions)

### Usage :
- Rename `config.example.json` to `config.json`
- Set your binance api keys in `config.json`
- Run on your terminal `yarn start` (for first execution run first `yarn` to initialize dependencies)
- Acces your server ip in your browser (eg. `http://127.0.0.1`)

## Security
By default Lickui will only accept local connections, in order also to allow internet acces, you can specify the public ip in `config.json`, and create firewall riles if needed.