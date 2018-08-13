import Create from "components/Bots/SpreadTrade/CreateForm";
import State from "components/Bots/SpreadTrade/StateForm";
import {ChainStore} from "bitsharesjs";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";
//import MarketsActions from "actions/MarketsActions";
import Account from "lib/bots/account";
import SettingsActions from "actions/SettingsActions";
import WalletUnlockActions from "actions/WalletUnlockActions";
import axios from "axios";

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
                //movePercent: initData.movePercent,
                defaultPrice: initData.defaultPrice
            });
        }

        this.name = storage.read().name;

        this.logger = console;
        this.queueEvents = Promise.resolve();
        this.run = false;
    }

    async start() {
        console.log("start");
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

        this.defaultPrice = state.defaultPrice;

        let feedPrice = await this.getFeed(),
            buyPrice = feedPrice.div(1 + state.base.spread / 100).toNumber(),
            sellPrice = feedPrice
                .times(1 + state.quote.spread / 100)
                .toNumber();

        feedPrice = feedPrice.toNumber();

        if (feedPrice == 0) return;

        console.log("feed", feedPrice, buyPrice, sellPrice);
        console.log("Orders id", state.base.order.id, state.quote.order.id);

        let buyOrder = state.base.order.id
                ? (await Apis.db.get_objects([state.base.order.id]))[0]
                : state.base.order.id,
            sellOrder = state.quote.order.id
                ? (await Apis.db.get_objects([state.quote.order.id]))[0]
                : state.quote.order.id;

        if (buyOrder) {
            //check Price
            if (
                /*
                new BigNumber(Math.abs(buyPrice - state.base.order.price))
                    .div(state.base.order.price)
                    .isGreaterThanOrEqualTo(state.movePercent / 100)*/
                Math.abs(buyPrice - state.base.order.price) >
                Math.abs(feedPrice - buyPrice) / 2
            ) {
                // move order

                this.logger.info(
                    `move buy order: ${buyPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.base.order.id);

                // check amount in order
                let orderAmount = new BigNumber(buyOrder.for_sale)
                    .div(10 ** this.base.precision)
                    .toNumber();
                state.base.balance += orderAmount;

                // add to sell balance
                if (state.base.order.amount > orderAmount)
                    state.quote.balance += new BigNumber(
                        state.base.order.amount - orderAmount
                    )
                        .div(state.base.order.price)
                        .toNumber();

                let accountBalance =
                    (await this.account.balances(this.base.symbol))[0].amount /
                    10 ** this.base.precision;
                let amount = Math.min(
                    accountBalance,
                    state.base.balance,
                    state.base.amount
                );
                try {
                    let obj = await this.account.sell(
                        this.base.symbol,
                        this.quote.symbol,
                        amount,
                        new BigNumber(1).div(buyPrice).toNumber()
                    );
                    state.base.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        amount
                    };
                    state.base.balance -= amount;
                } catch (error) {
                    this.logger.error(error);
                    state.base.order.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.base.order.id)) {
                // fill order
                state.quote.balance += new BigNumber(state.base.order.amount)
                    .div(state.base.order.price)
                    .toNumber();
                state.base.order.id = undefined;
            }

            let accountBalance = new BigNumber(
                (await this.account.balances(this.base.id))[0].amount
            )
                .div(10 ** this.base.precision)
                .toNumber();

            if (
                Math.min(accountBalance, state.base.balance) >=
                state.base.amount
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
                        new BigNumber(1).div(new BigNumber(buyPrice)).toNumber()
                    );
                    state.base.order = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        amount: state.base.amount
                    };
                    state.base.balance -= state.base.amount;
                } catch (error) {
                    this.logger.error(error);
                }
            }
        }

        if (sellOrder) {
            //check Price
            if (
                /*
                new BigNumber(Math.abs(sellPrice - state.quote.order.price))
                    .div(state.quote.order.price)
                    .isGreaterThanOrEqualTo(state.movePercent / 100)*/
                Math.abs(sellPrice - state.quote.order.price) >
                Math.abs(feedPrice - sellPrice) / 2
            ) {
                // move order

                this.logger.info(
                    `move sell order: ${sellPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.quote.order.id);

                // check amount in order
                let orderAmount = new BigNumber(sellOrder.for_sale)
                    .div(10 ** this.quote.precision)
                    .toNumber();
                state.quote.balance += orderAmount;

                // add to buy balance
                if (state.quote.order.amount > orderAmount)
                    state.base.balance += new BigNumber(
                        state.quote.order.amount - orderAmount
                    )
                        .times(state.quote.order.price)
                        .toNumber();

                let accountBalance = new BigNumber(
                    (await this.account.balances(this.quote.symbol))[0].amount
                )
                    .div(10 ** this.quote.precision)
                    .toNumber();
                let amount = Math.min(
                    accountBalance,
                    state.quote.balance,
                    state.quote.amount
                );
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
                    state.quote.balance -= amount;
                } catch (error) {
                    this.logger.error(error);
                    state.quote.order.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.quote.order.id)) {
                // fill order
                state.base.balance += new BigNumber(state.quote.order.amount)
                    .times(state.quote.order.price)
                    .toNumber();
                state.quote.order.id = undefined;
            }

            let accountBalance = new BigNumber(
                (await this.account.balances(this.quote.id))[0].amount
            )
                .div(10 ** this.quote.precision)
                .toNumber();

            if (
                Math.min(accountBalance, state.quote.balance) >=
                state.quote.amount
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
                    state.quote.balance -= state.quote.amount;
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

        return new BigNumber(base.amount)
            .div(10 ** this.base.precision)
            .div(new BigNumber(quote.amount).div(10 ** this.quote.precision));
    }

    async getSmartFeed() {
        let bts = await Assets["bts"];
        await this.base.update();
        let rate = this.base.options.core_exchange_rate;
        let [base, quote] =
            rate.base.asset_id == "1.3.0"
                ? [rate.base, rate.quote]
                : [rate.quote, rate.base];

        let basePrice = new BigNumber(base.amount)
            .div(10 ** bts.precision)
            .div(new BigNumber(quote.amount).div(10 ** this.base.precision));

        await this.quote.update();
        rate = this.quote.options.core_exchange_rate;
        if (rate.base.asset_id == "1.3.0") {
            base = rate.base;
            quote = rate.quote;
        } else {
            base = rate.quote;
            quote = rate.base;
        }

        let quotePrice = new BigNumber(base.amount)
            .div(10 ** bts.precision)
            .div(new BigNumber(quote.amount).div(10 ** this.quote.precision));

        return quotePrice.div(basePrice);
    }

    async getUIAFeed() {
        return this.defaultPrice
            ? new BigNumber(this.defaultPrice)
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
            let data = await axios.get(
                "https://api.binance.com/api/v1/trades",
                {params: {symbol: asset, limit: 1}}
            );
            this.priceArray.push(data.data[0].price);
            //this.priceArray.push(10)
        } catch (error) {
            this.logger.error(
                `Error Binance request: ${asset}, error: ${error}`
            );
        }

        if (this.priceArray.length > 10) this.priceArray.shift();

        return this.priceArray.length > 0
            ? this.priceArray
                  .reduce((a, b) => a.plus(b), new BigNumber(0))
                  .div(this.priceArray.length)
            : new BigNumber(0);
    }
}

export default SpreadTrade;
