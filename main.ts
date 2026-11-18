// Spike Rider: a short-window momentum breakout bot for cbBTC, long only.
//
// Idea: on 1-minute bars the dev window is a slow bleed (-2.8% over 24h) with
// sharp, short-lived up-spikes. Trend-following on slow EMAs whipsaws to death
// here (the EMA(8)/EMA(21) baseline loses $148), and buying dips loses because
// down-moves persist (after a -40bp 5-minute move the next 5 minutes average
// -27bp). What works is the opposite: wait in cash, and only jump in when a
// strong up-move is already under way (a W-minute return above T basis points),
// then get out fast on a small take-profit or a tight stop. The up-move has
// mild positive continuation (after a +40bp 5-minute move the next 5 minutes
// average +10bp and are positive 53% of the time), and the tight exits keep
// each loss small while the winners cover the ~26bp round-trip cost.
//
// Rules (all decisions on a bar's close, filled at the next bar's open):
// - Entry: not holding, not warming up, and the W-minute return of the latest
//   close is >= T bps. Buy with all free cash (capped by max_weight_bps and
//   the minimum notional).
// - Exit: holding, sell the whole position when its gain is >= TP bps above
//   cost, or <= -SL bps below cost.
// - One symbol (CBBTC), one position at a time, full size per trade.
// - Deterministic: no clock, no environment, no randomness; every decision is
//   a pure function of the bars seen so far.

import { runBars, type BarsState, type Batch, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const WINDOW_BARS = 3; // W: momentum window in bars (minutes)
const ENTRY_BPS = 40; // T: W-minute return that triggers an entry
const TAKE_PROFIT_BPS = 60; // TP: sell when the position gains this much
const STOP_LOSS_BPS = 60; // SL: sell when the position loses this much
const MAX_SLIPPAGE_BPS = 100;

const closes: bigint[] = [];

await runBars({
  onBatch(state: BarsState, batch: Batch): (BuyInput | SellInput)[] {
    if (state.warmingUp) return [];
    // Only record a close when this batch actually carries a fresh CBBTC bar
    // (a minute with no sample has no bar; re-using a stale close would fake
    // the momentum window).
    const fresh = batch.bars.filter((b) => b.symbol === SYMBOL);
    if (fresh.length === 0) return [];
    closes.push(BigInt(fresh[fresh.length - 1].c));

    const held = state.positions.get(SYMBOL);
    if (held !== undefined) {
      const value = state.value(SYMBOL, held.qty);
      if (held.cost > 0n) {
        const gainBps = ((value - held.cost) * 10000n) / held.cost;
        if (gainBps >= BigInt(TAKE_PROFIT_BPS) || gainBps <= BigInt(-STOP_LOSS_BPS)) {
          return [{ side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS }];
        }
      }
      return [];
    }

    if (closes.length <= WINDOW_BARS) return [];
    const now = closes[closes.length - 1];
    const then = closes[closes.length - 1 - WINDOW_BARS];
    const retBps = ((now - then) * 10000n) / then;
    if (retBps < BigInt(ENTRY_BPS)) return [];
    const room = state.weightRoom(SYMBOL);
    let spend = state.cash < room ? state.cash : room;
    if (spend <= 0n || spend < BigInt(state.hello.fees.min_notional_quote_units)) return [];
    return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: spend, max_slippage_bps: MAX_SLIPPAGE_BPS }];
  },
});
