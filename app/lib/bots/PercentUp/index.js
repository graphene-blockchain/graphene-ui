import Create from "components/Bots/PercentUp/Create";
import State from "components/Bots/PercentUp/State";
import Account from "lib/bots/account";
import {ChainStore} from "bitsharesjs";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";
import SettingsActions from "actions/SettingsActions";
import WalletUnlockActions from "actions/WalletUnlockActions";

class PercentUp {
    static create = Create;
    state = State;

    constructor(account, storage, initData) {
        this.account = new Account(account);
        this.storage = storage;

        if (initData) {
            let {
                name,
                base,
                quote,
                amount,
                percentAmount,
                balance,
                spread,
                distance
            } = initData;
            storage.init({
                name,
                base,
                quote,
                amount,
                percentAmount,
                balance,
                spread,
                distance,
                orders: []
            });
        }

        this.name = storage.read().name;

        this.logger = console;
        this.queueEvents = Promise.resolve();
        this.run = false;
    }

    async start() {
        let state = this.storage.read();

        this.base = await Assets[state.base];
        this.quote = await Assets[state.quote];

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
        let state = this.storage.read(),
            log = (...args) => this.logger.log(`[${state.name}]`, ...args),
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
            balance =
                state.balance === "-"
                    ? 0
                    : state.balance === ""
                        ? accountBalances.base
                        : Math.min(accountBalances.base, state.balance),
            amount =
                state.percentAmount.toString() == "true"
                    ? BigNumber(balance)
                          .times(state.amount)
                          .div(100)
                          .toNumber()
                    : state.amount,
            orders = (await Apis.db.get_objects(
                state.orders.map(order => order.id).filter(id => id)
            ))
                .map(order => order && order.id)
                .filter(id => id),
            processOrders = state.orders.filter(
                order => !orders.includes(order.id)
            );

        if (processOrders.length > 0) await this.base.update();

        let promises = processOrders.map(async order => {
            if (order.state === "buy") {
                order.id = null;
                if (!["", "-"].includes(state.balance)) {
                    let amountToMarket = Math.floor(
                        BigNumber(this.base.options.market_fee_percent)
                            .div(100 * 100)
                            .times(order.base)
                            .times(10 ** this.base.precision)
                            .toString()
                    );
                    state.balance =
                        Number(state.balance) +
                        Number(order.base) -
                        (amountToMarket !== 0
                            ? BigNumber(amountToMarket)
                                  .div(10 ** this.base.precision)
                                  .toNumber()
                            : this.base.options.market_fee_percent !== 0
                                ? 10 ** -this.base.precision
                                : 0);
                }
            } else {
                let quoteAssetAmount = {
                        asset_id: this.quote.id,
                        amount: Math.min(
                            Number(accountBalances.quote),
                            Number(order.quote)
                        )
                    },
                    percentOnMarket = BigNumber(
                        this.base.options.market_fee_percent
                    ).div(100 * 100),
                    baseAssetAmount = {
                        asset_id: this.base.id,
                        amount: BigNumber(order.base).times(
                            1 +
                                Number(state.spread) / 100 +
                                percentOnMarket.toNumber()
                        )
                    };

                log(
                    `buy ${
                        this.base.symbol
                    }: amount=${baseAssetAmount.amount.toNumber()} price=${BigNumber(
                        quoteAssetAmount.amount
                    )
                        .div(baseAssetAmount.amount)
                        .toNumber()} ${this.base.symbol}/${this.quote.symbol}`
                );
                let obj = await this.account.sell(
                    quoteAssetAmount,
                    baseAssetAmount
                );

                order.state = "buy";
                order.id = obj ? obj.id : "1.7.0";
                order.base = baseAssetAmount.amount.toNumber();
            }
        });

        await Promise.all(promises);

        let lowPrice = null;
        state.orders.forEach(order => {
            let price = BigNumber(order.quote).div(order.base);
            if (!lowPrice || price.isLessThan(lowPrice)) lowPrice = price;
        });

        let ticker = await Apis.db.get_ticker(
                this.quote.symbol,
                this.base.symbol
            ),
            price = BigNumber(ticker.lowest_ask);

        log(
            `Orders exists: ${!!lowPrice}, balance > amount: ${balance >
                amount}, lowPrice - price > distance: ${!!lowPrice &&
                lowPrice
                    .times(1 - Number(state.distance) / 100)
                    .isGreaterThan(price)}`
        );
        if (
            balance > amount &&
            (!lowPrice ||
                lowPrice
                    .times(1 - Number(state.distance) / 100)
                    .isGreaterThan(price))
        ) {
            let baseAssetAmount = {
                    asset_id: this.base.id,
                    amount
                },
                quoteAssetAmount = {
                    asset_id: this.quote.id,
                    amount: price.times(amount)
                },
                obj = await this.account.buy(quoteAssetAmount, baseAssetAmount),
                order = {
                    state: "sell",
                    base: amount,
                    quote: quoteAssetAmount.amount.toNumber(),
                    id: obj ? obj.id : "1.7.0"
                };

            state.orders.push(order);
            log(
                `sell ${
                    this.base.symbol
                }: amount=${amount}, price=${price.toNumber()} ${
                    this.base.symbol
                }/${this.quote.symbol}`
            );

            if (!["", "-"].includes(state.balance))
                state.balance = Number(state.balance) - amount;
        }

        state.orders = state.orders.filter(order => order.id !== null);

        this.storage.write(state);
    };
}

export default PercentUp;
