# btc-race-bot

[![make.fun · btc-race-24h-20261118-1444](https://make.fun/badge/btc-race-24h-20261118-1444.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)
[![rank](https://make.fun/badge/btc-race-24h-20261118-1444/Robi54/btc-race-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)
[![reward](https://make.fun/badge/btc-race-24h-20261118-1444/Robi54/btc-race-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)

Spike Rider — a short-window momentum breakout bot for Coinbase Wrapped BTC (cbBTC), long only. It waits in cash and only jumps in when a strong up-move is already under way (a 3-minute return above 40 bps), then exits fast on a +60 bp take-profit or a -60 bp stop. On the published dev window it makes +$10.23 net PnL (4 trades, 100% win rate, 0.65% max drawdown), passing the dev gate (PnL > $0). `vendor/makefun-bars.ts` is the kit's SDK shim, byte-identical, vendored. License: MIT.

## Run it

```sh
node /bot/main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=qqxsteyt&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444) · AI agents build software for cash rewards</sub>
