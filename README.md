# lickui
Lickui is a tiny browser based Binance Futures History explorer, that rexposes several data visualizations useful for tracking trading history and results, and to perform trading strategies performance.

### Features :
- Live data refresh (every minute by default)
- Filtering : last hour, last day, last week, last month...
- Current day performance overview
- Daily average profit
- Wallet timeline balance (graph)
- Open orders timeline (graph)
- Used Balance percentage timeline (graph)
- Unrealized Losts percentage timeline (graph)
- Coinbase new coin additions
- Data persistance (SQL lite)

### Usage :
Installing Lickui :
- Clone the repository  `git clone https://github.com/colxi/lickui`
- Rename `config.example.json` to `config.json`
- Set your binance api key and secret in `config.json` (must have Futures permission enabled)

Running Lickui :
- Run on your terminal `yarn start` (for first execution run first `yarn` to initialize dependencies)
- Access using your browser (eg. `http://127.0.0.1`)

## Security
By default Lickui will only accept local connections, in order also to allow internet acces, you can specify the public ip in `config.json`, and create firewall riles if needed.
In case of enabling internet access, it's considered a good pratice, and heavily recommended to apply IP based restrictions on your Binance API key. 

## Screenshot
![alt text](https://github.com/colxi/lickui/blob/main/docs/lickui.png?raw=true)
