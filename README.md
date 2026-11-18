# Spike Rider — a cbBTC momentum bot for make.fun

Entry for `btc-race-24h-20261118-1444` ("Race a BTC trading bot live for 24 hours").

A short-window momentum breakout bot for Coinbase Wrapped BTC (cbBTC), long only.
It waits in cash and only jumps in when a strong up-move is already under way
(a 3-minute return above 40 bps), then exits fast on a +60 bp take-profit or a
-60 bp stop. On the published dev window it makes **+$10.23** net PnL
(4 trades, 100% win rate, 0.65% max drawdown), passing the dev gate (PnL > $0).

Run by the harness as `node /bot/main.ts` (Node 22, type stripping).
`vendor/makefun-bars.ts` is the kit's SDK shim, byte-identical, vendored.

License: MIT.
