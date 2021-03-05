# Bots

## Bot SpreadTrade

STEP-BY-STEP INSTRUCTION:

Basic settings:

* base and quote fields: specify the trading pair that bot uses;
* balance field: balance available to the bot for using in base & quote;
* amount field: the amount of the asset, that is placed in the orders (absolute numbers if the value is chosen, or percentage of the balance if the balance % is chosen);
* spread field: spread from the center price for every asset pair;
* default price: the default price, if this isn’t a bitAsset;
* get a price from the market: sets if to take the price from the market or not;
After starting the bot subscribes for a new block in the blockchain. Every time the new block is received it checks two orders: to buy and sell.

If there is no order, it checks if the new order will be executed on placement with the price equal to feed_price * (1 ± spread / 100) and if the balance is sufficient to place an order with the amount.
If the balance is sufficient and the order wouldn’t be immediately executed, then the new order is placed. After placing the order, the balance field is diminished by amount.

If an order exists, the feed_price is checked against the order price. If the prices differ more than spread / 2, and placing the order at feed_price * (1 ± spread / 100) will not immediately execute it, the bot decides to move the order to feed_price * (1 ± spread / 100).
To that end, it cancels the current order, increments the balance by the amount remaining in the canceled order, and then creates a new order with required price and an amount that is lower between balance and amount.

* If the balance field is a number. If the order for the base asset was placed, but after the current check it wasn’t found, then the bot considers an order to be executed. On top of the actions described above, balance for quote asset is incremented by the price of the executed order, and similar checks exist for the quote order.

* If the balance field is left blank. Then the bot uses full balance of the account that the bot is running from.

* If the balance field is set to “-”, then the asset balance is considered to be 0, and is not changed.

Price calculation. If the get price from market is set, then the price is taken from the market. If the assets are a pair of a smart asset, and core asset (BTS), then the prices are recalculated against base asset using the price, that was taken from the blockchain. For the smartcoin pairs that don’t use the core asset (BTS), the recalculation happens in two steps: the first one calculates price against BTS, and then to the base asset.
For the pairs that only have MPA (or only UIA), there is a check if default price is set. If it is empty, then the bot asks binance.com for a feed. For 2nd tier assets (RUDEX.BTC, OPEN.BTC, etc) the prefixes are dropped. USD matches to USDT. For example the query for OPEN.BTC/OPEN.USD is sent as a BTC/USDT pair.

If the pair doesn’t exist on Binance, then the price is set to 0, and no trading happens.

You can find the video tutorial at the link below:

https://steemit.com/blockchain/@blockchained/announcement-of-a-public-trading-bots-from-rudex-spreadtrade-and-trailingstop