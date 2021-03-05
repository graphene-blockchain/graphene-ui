# Bots

## Bot TrailingStop

STEP-BY-STEP INSTRUCTION:

Basic settings:

* sellAsset & getAsset: are the asset to sell, and to buy respectively;
* amount: is the amount of asset to sell;
* stoploss & minAmount: the price after which an order is created, and the minimum amount of asset from getAsset;
* trailing percent: the maximum difference between stoploss price and current price.
* Stoploss field and minAmount are linked and shown only for the ease of setting up the bot.

After starting the bot subscribes to the new block in the blockchain. Every time after receiving a block it checks the market price.

If the market price is higher than stoploss by more than trailing_percent, then the stoploss price is changed by this difference. If the market price is lower than stoploss + trailing_percent / 3, then the order to sell sellAsset with the stoploss price and amount is placed.

After placing the order the bot stops.


You can find the video tutorial at the link below:

https://steemit.com/blockchain/@blockchained/announcement-of-a-public-trading-bots-from-rudex-spreadtrade-and-trailingstop