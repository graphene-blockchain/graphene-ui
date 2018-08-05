import Create from "components/Bots/SpreadTrade/CreateForm";
import State from "components/Bots/SpreadTrade/StateForm";
import {ChainStore} from "bitsharesjs";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";

class SpreadTrade {
    static create = Create;
    state = State;

    constructor(account, storage, initData) {
        this.account = account;
        this.storage = storage;
        //this.config = initData

        //State.props.storage = storage
        if (initData) storage.init(initData);

        this.name = storage.read().name;

        this.logger = console;
        this.queueEvents = Promise.resolve();
    }

    async start() {
        console.log("start");
        let state = this.storage.read();

        this.base = await Assets[state.baseAsset];
        this.quote = await Assets[state.quoteAsset];

        if ([this.base.issuer, this.quote.issuer].includes("1.2.0")) {
            if ([this.base.id, this.quote.id].includes("1.3.0"))
                this.getFeed = this.getCoreFeed;
            else if (this.base.issuer == this.quote.issuer)
                this.getFeed = this.getSmartFeed;
            else this.getFeed = this.getUIAFeed;
        } else {
            this.getFeed = this.getUIAFeed;
        }

        ChainStore.subscribe(this.queue);
        this.queue();
    }

    async stop() {
        ChainStore.unsubscribe(this.queue);
    }

    queue = () => {
        this.queueEvents = this.queueEvents
            .then(this.checkOrders)
            .catch(this.logger.error.bind(this.logger));
    };

    checkOrders = async () => {
        let state = this.storage.read();

        let feedPrice = await this.getFeed(),
            buyPrice = feedPrice.div(1 + state.baseSpread / 100).toNumber(),
            sellPrice = feedPrice.times(1 + state.quoteSpread / 100).toNumber();

        feedPrice = feedPrice.toNumber();

        if (feedPrice == 0) return;

        console.log("feed", feedPrice, buyPrice, sellPrice);
        return;

        let buyOrder = state.buy.id
                ? await this.account.getOrder(state.buy.id)
                : state.buy.id,
            sellOrder = state.sell.id
                ? await this.account.getOrder(state.sell.id)
                : state.sell.id;

        if (buyOrder) {
            //check Price
            if (
                new BigNumber(Math.abs(buyPrice - state.buy.price))
                    .div(state.buy.price)
                    .isGreaterThanOrEqualTo(this.conf.movePercent / 100)
            ) {
                // move order

                this.logger.info(
                    `move buy order: ${buyPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.buy.id);

                // check amount in order
                let orderAmount = new BigNumber(buyOrder.for_sale)
                    .div(10 ** this.base.precision)
                    .toNumber();
                state.buy.balance += orderAmount;

                // add to sell balance
                if (state.buy.amount > orderAmount)
                    state.sell.balance += new BigNumber(
                        state.buy.amount - orderAmount
                    )
                        .div(state.buy.price)
                        .toNumber();

                let accountBalance =
                    (await this.account.balances(this.base.symbol))[0].amount /
                    10 ** this.base.precision;
                let amount = Math.min(
                    accountBalance,
                    state.buy.balance,
                    this.conf.base.amount
                );
                try {
                    let obj = await this.account.sell(
                        this.base.symbol,
                        this.quote.symbol,
                        amount,
                        new BigNumber(1).div(buyPrice).toNumber()
                    );
                    state.buy = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        balance: state.buy.balance - amount,
                        amount
                    };
                } catch (error) {
                    this.logger.error(error);
                    state.buy.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.buy.id)) {
                // fill order
                state.sell.balance += new BigNumber(state.buy.amount)
                    .div(state.buy.price)
                    .toNumber();
                state.buy.id = undefined;
            }

            let accountBalance = new BigNumber(
                (await this.account.balances(this.base.symbol))[0].amount
            )
                .div(10 ** this.base.precision)
                .toNumber();

            if (
                Math.min(accountBalance, state.buy.balance) >=
                this.conf.base.amount
            ) {
                //buy
                this.logger.info(
                    `buy: ${buyPrice} ${this.quote.symbol}/${this.base.symbol}`
                );
                try {
                    let obj = await this.account.sell(
                        this.base.symbol,
                        this.quote.symbol,
                        this.conf.base.amount,
                        new BigNumber(1).div(buyPrice).toNumber()
                    );
                    state.buy = {
                        id: obj ? obj.id : "1.7.0",
                        price: buyPrice,
                        balance: state.buy.balance - this.conf.base.amount,
                        amount: this.conf.base.amount
                    };
                } catch (error) {
                    this.logger.error(error);
                }
            }
        }

        if (sellOrder) {
            //check Price
            if (
                new BigNumber(Math.abs(sellPrice - state.sell.price))
                    .div(state.sell.price)
                    .isGreaterThanOrEqualTo(this.conf.movePercent / 100)
            ) {
                // move order

                this.logger.info(
                    `move sell order: ${sellPrice} ${this.quote.symbol}/${
                        this.base.symbol
                    }`
                );
                await this.account.cancelOrder(state.sell.id);

                // check amount in order
                let orderAmount = new BigNumber(sellOrder.for_sale)
                    .div(10 ** this.quote.precision)
                    .toNumber();
                state.sell.balance += orderAmount;

                // add to buy balance
                if (state.sell.amount > orderAmount)
                    state.buy.balance += new BigNumber(
                        state.sell.amount - orderAmount
                    )
                        .times(state.sell.price)
                        .toNumber();

                let accountBalance = new BigNumber(
                    (await this.account.balances(this.quote.symbol))[0].amount
                )
                    .div(10 ** this.quote.precision)
                    .toNumber();
                let amount = Math.min(
                    accountBalance,
                    state.sell.balance,
                    this.conf.quote.amount
                );
                try {
                    let obj = await this.account.sell(
                        this.quote.symbol,
                        this.base.symbol,
                        amount,
                        sellPrice
                    );
                    state.sell = {
                        id: obj ? obj.id : "1.7.0",
                        price: sellPrice,
                        balance: state.sell.balance - amount,
                        amount
                    };
                } catch (error) {
                    this.logger.error(error);
                    state.sell.id = undefined;
                }
            }
        } else {
            if (/^1.7.\d*$/.test(state.sell.id)) {
                // fill order
                state.buy.balance += new BigNumber(state.sell.amount)
                    .times(state.sell.price)
                    .toNumber();
                state.sell.id = undefined;
            }

            let accountBalance = new BigNumber(
                (await this.account.balances(this.quote.symbol))[0].amount
            )
                .div(10 ** this.quote.precision)
                .toNumber();

            if (
                Math.min(accountBalance, state.sell.balance) >=
                this.conf.quote.amount
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
                        this.conf.quote.amount,
                        sellPrice
                    );
                    state.sell = {
                        id: obj ? obj.id : "1.7.0",
                        price: sellPrice,
                        balance: state.sell.balance - this.conf.quote.amount,
                        amount: this.conf.quote.amount
                    };
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
        //return BigNumber(this.conf.defaultPrice++)
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
