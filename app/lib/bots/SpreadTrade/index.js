import Create from "components/Bots/SpreadTrade/CreateForm";
import State from "components/Bots/SpreadTrade/StateForm";
import {ChainStore} from "bitsharesjs";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";
import Account from "lib/bots/account";
import SettingsActions from "actions/SettingsActions";
import WalletUnlockActions from "actions/WalletUnlockActions";

class SpreadTrade {
    static create = Create;
    state = State;

    constructor(account, storage, initData) {
        this.account = new Account(account);
        this.storage = storage;

        if (initData) {
            storage.init({
                name: initData.name,
                base: {
                    asset: initData.baseAsset,
                    balance: initData.baseBalance,
                    spread: initData.baseSpread,
                    amount: initData.baseAmount,
                    order: {
                        //id, price and amount
                    }
                },
                quote: {
                    asset: initData.quoteAsset,
                    balance: initData.quoteBalance,
                    spread: initData.quoteSpread,
                    amount: initData.quoteAmount,
                    order: {
                        //id, price and amount
                    }
                },
                defaultPrice: initData.defaultPrice
            });
        }

        this.name = storage.read().name;

        this.logger = console;
        this.queueEvents = Promise.resolve();
        this.run = false;
    }

    async start() {
        let state = this.storage.read();

        this.base = await Assets[state.base.asset];
        this.quote = await Assets[state.quote.asset];

        if ([this.base.issuer, this.quote.issuer].includes("1.2.0")) {
            if ([this.base.id, this.quote.id].includes("1.3.0"))
                this.getFeed = this.getCoreFeed;
            else if (this.base.issuer == this.quote.issuer)
                this.getFeed = this.getSmartFeed;
            else this.getFeed = this.getUIAFeed;
        } else {
            this.getFeed = this.getUIAFeed;
        }

        await WalletUnlockActions.unlock();
        SettingsActions.changeSetting({
            setting: "walletLockTimeout",
            value: 0
        });

        ChainStore.subscribe(this.queue);
        this.run = true;
    }

    async stop() {
        ChainStore.unsubscribe(this.queue);
        this.run = false;
        await this.queueEvents;
    }

    delete() {
        this.storage.delete();
    }

    queue = () => {
        this.queueEvents = this.queueEvents
            .then(this.checkOrders)
            .catch(this.logger.error.bind(this.logger));
    };

    checkOrders = async () => {
        let state = this.storage.read();
        //console.log("state", state);

        this.defaultPrice = state.defaultPrice;

        let feedPrice = await this.getFeed(),
            buyPrice = feedPrice.times(1 - state.base.spread / 100).toNumber(),
            sellPrice = feedPrice
                .times(1 + state.quote.spread / 100)
                .toNumber();

        feedPrice = feedPrice.toNumber();

        if (feedPrice == 0) return;

        let buyOrder = state.base.order.id
                ? (await Apis.db.get_objects([state.base.order.id]))[0]
                : state.base.order.id,
            sellOrder = state.quote.order.id
                ? (await Apis.db.get_objects([state.quote.order.id]))[0]
                : state.quote.order.id,
            ticker = await Apis.db.get_ticker(
                this.base.symbol,
                this.quote.symbol
            ),
            accountBalances = (await this.account.balances(
                this.base.id,
                this.quote.id
            )).reduce((acc, balance) => {
                this.base.id === balance.asset_id
                    ? (acc.base = BigNumber(balance.amount)
                          .div(10 ** this.base.precision)
                          .toNumber())
                    : (acc.quote = BigNumber(balance.amount)
                          .div(10 ** this.quote.precision)
                          .toNumber());
                return acc;
            }, {}),
            baseBalance =
                state.base.balance === "-"
                    ? 0
                    : state.base.balance === ""
                        ? accountBalances.base
                        : Math.min(accountBalances.base, state.base.balance),
            quoteBalance =
                state.quote.balance === "-"
                    ? 0
                    : state.quote.balance === ""
                        ? accountBalances.quote
                        : Math.min(accountBalances.quote, state.quote.balance);

        console.log("prices", buyPrice, feedPrice, sellPrice);
        console.log("orders", buyOrder, sellOrder);

        if (buyOrder) {
            //check Price
            console.log(
                `check buyOrder: move=${Math.abs(
                    buyPrice - state.base.order.price
                ) >
                    Math.abs(feedPrice - buyPrice) /
                        2}, fill=${ticker.lowest_ask <= buyPrice}`
            );
            if (
                Math.abs(buyPrice - state.base.order.price) >
                    Math.abs(feedPrice - buyPrice) / 2 &&
                ticker.lowest_ask > buyPrice
            ) {
                // move order

                this.logger.info(
                    `move buy order: ${buyPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.base.order.id);

                // check amount in order
                let orderAmount = BigNumber(buyOrder.for_sale)
                    .div(10 ** this.base.precision)
                    .toNumber();

                !["", "-"].includes(state.base.balance) &&
                    (state.base.balance =
                        Number(state.base.balance) + orderAmount);

                // add to sell balance
                if (
                    state.base.order.amount > orderAmount &&
                    !["", "-"].incudes(state.quote.balance)
                )
                    state.quote.balance = BigNumber(
                        state.base.order.amount - orderAmount
                    )
                        .div(state.base.order.price)
                        .plus(state.quote.balance)
                        .toNumber();

                let amount = Math.min(baseBalance, state.base.amount);
                try {
                    let obj = await this.account.sell(
                        this.base.symbol,
                        this.quote.symbol,
                        amount,
                        BigNumber(1)
                            .div(buyPrice)
                            .toNumber()
                    );
                    state.base.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        amount
                    };
                    !["", "-"].includes(state.base.balance) &&
                        (state.base.balance -= amount);
                } catch (error) {
                    this.logger.error(error);
                    state.base.order.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.base.order.id)) {
                // fill order
                !["", "-"].includes(state.quote.balance) &&
                    (state.quote.balance = BigNumber(state.base.order.amount)
                        .div(state.base.order.price)
                        .plus(state.quote.balance)
                        .toNumber());

                state.base.order.id = undefined;
            }

            console.log(
                `create buyOrder: balance=${baseBalance >=
                    state.base.amount}, fill=${ticker.lowest_ask <= buyPrice}`
            );
            if (
                baseBalance >= state.base.amount &&
                ticker.lowest_ask > buyPrice
            ) {
                //buy
                this.logger.info(
                    `buy: ${buyPrice} ${this.quote.symbol}/${this.base.symbol}`
                );
                try {
                    let obj = await this.account.sell(
                        this.base.symbol,
                        this.quote.symbol,
                        state.base.amount,
                        BigNumber(1)
                            .div(buyPrice)
                            .toNumber()
                    );
                    state.base.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        amount: state.base.amount
                    };
                    !["", "-"].includes(state.base.balance) &&
                        (state.base.balance -= state.base.amount);
                } catch (error) {
                    this.logger.error(error);
                }
            }
        }

        if (sellOrder) {
            //check Price
            console.log(
                `check sellOrder: move=${Math.abs(
                    sellPrice - state.quote.order.price
                ) >
                    Math.abs(feedPrice - sellPrice) /
                        2}, fill=${ticker.highest_bid >= sellPrice}`
            );
            if (
                Math.abs(sellPrice - state.quote.order.price) >
                    Math.abs(feedPrice - sellPrice) / 2 &&
                ticker.highest_bid < sellPrice
            ) {
                // move order

                this.logger.info(
                    `move sell order: ${sellPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.quote.order.id);

                // check amount in order
                let orderAmount = BigNumber(sellOrder.for_sale)
                    .div(10 ** this.quote.precision)
                    .toNumber();
                !["", "-"].includes(state.quote.balance) &&
                    (state.quote.balance =
                        Number(state.quote.balance) + orderAmount);

                // add to buy balance
                if (
                    state.quote.order.amount > orderAmount &&
                    !["", "-"].includes(state.base.balance)
                )
                    state.base.balance = BigNumber(
                        state.quote.order.amount - orderAmount
                    )
                        .times(state.quote.order.price)
                        .plus(state.base.balance)
                        .toNumber();

                let amount = Math.min(quoteBalance, state.quote.amount);
                try {
                    let obj = await this.account.sell(
                        this.quote.symbol,
                        this.base.symbol,
                        amount,
                        sellPrice
                    );
                    state.quote.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: sellPrice,
                        amount
                    };
                    !["", "-"].includes(state.quote.balance) &&
                        (state.quote.balance -= amount);
                } catch (error) {
                    this.logger.error(error);
                    state.quote.order.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.quote.order.id)) {
                // fill order
                !["", "-"].includes(state.base.balance) &&
                    (state.base.balance = BigNumber(state.quote.order.amount)
                        .times(state.quote.order.price)
                        .plus(state.base.balance)
                        .toNumber());
                state.quote.order.id = undefined;
            }

            console.log(
                `create sellOrder: balance=${quoteBalance >=
                    state.quote.amount}, fill=${ticker.highest_bid >=
                    sellPrice}`
            );
            if (
                quoteBalance >= state.quote.amount &&
                ticker.highest_bid < sellPrice
            ) {
                //buy
                this.logger.info(
                    `sell: ${sellPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                try {
                    let obj = await this.account.sell(
                        this.quote.symbol,
                        this.base.symbol,
                        state.quote.amount,
                        sellPrice
                    );
                    state.quote.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: sellPrice,
                        amount: state.quote.amount
                    };
                    !["", "-"].includes(state.quote.balance) &&
                        (state.quote.balance -= state.quote.amount);
                } catch (error) {
                    this.logger.error(error);
                }
            }
        }

        this.storage.write(state);
    };

    async getCoreFeed() {
        let rate;

        if (this.base.id == "1.3.0") {
            await this.quote.update();
            rate = this.quote.options.core_exchange_rate;
        } else {
            await this.base.update();
            rate = this.base.options.core_exchange_rate;
        }

        let [base, quote] =
            rate.base.asset_id == this.base.id
                ? [rate.base, rate.quote]
                : [rate.quote, rate.base];

        return BigNumber(base.amount)
            .div(10 ** this.base.precision)
            .div(BigNumber(quote.amount).div(10 ** this.quote.precision));
    }

    async getSmartFeed() {
        let bts = await Assets["bts"];
        await this.base.update();
        let rate = this.base.options.core_exchange_rate;
        let [base, quote] =
            rate.base.asset_id == "1.3.0"
                ? [rate.base, rate.quote]
                : [rate.quote, rate.base];

        let basePrice = BigNumber(base.amount)
            .div(10 ** bts.precision)
            .div(BigNumber(quote.amount).div(10 ** this.base.precision));

        await this.quote.update();
        rate = this.quote.options.core_exchange_rate;
        if (rate.base.asset_id == "1.3.0") {
            base = rate.base;
            quote = rate.quote;
        } else {
            base = rate.quote;
            quote = rate.base;
        }

        let quotePrice = BigNumber(base.amount)
            .div(10 ** bts.precision)
            .div(BigNumber(quote.amount).div(10 ** this.quote.precision));

        return quotePrice.div(basePrice);
    }

    async getUIAFeed() {
        return this.defaultPrice
            ? BigNumber(this.defaultPrice)
            : await this.binancePrice(this.base.symbol, this.quote.symbol);
    }

    async binancePrice(base, quote) {
        let asset = `${quote.split(".").slice(-1)[0]}${
            base.split(".").slice(-1)[0]
        }`
            .toUpperCase()
            .replace("USD", "USDT");
        console.log(`get asset: ${asset}`);
        this.priceArray = this.priceArray || [];

        try {
            //asset = "BTCUSDT"
            let response = await fetch(
                `https://api.binance.com/api/v1/trades?symbol=${asset}&limit=1`
            );
            let data = await response.json();
            this.priceArray.push(data[0].price);
            //this.priceArray.push(10)
        } catch (error) {
            this.logger.error(
                `Error Binance request: ${asset}, error: ${error}`
            );
        }

        if (this.priceArray.length > 10) this.priceArray.shift();

        return this.priceArray.length > 0
            ? this.priceArray
                  .reduce((a, b) => a.plus(b), BigNumber(0))
                  .div(this.priceArray.length)
            : BigNumber(0);
    }
}

export default SpreadTrade;
