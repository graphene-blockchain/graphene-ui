import Create from "components/Bots/TrailingStop/Create";
import State from "components/Bots/TrailingStop/State";
import {ChainStore} from "bitsharesjs";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";
import Account from "lib/bots/account";
import SettingsActions from "actions/SettingsActions";
import WalletUnlockActions from "actions/WalletUnlockActions";

class TrailingStop {
    static create = Create;
    state = State;

    constructor(account, storage, initData) {
        this.account = new Account(account);
        this.storage = storage;

        if (initData) {
            storage.init({
                name: initData.name,
                sellAsset: initData.sellAsset,
                getAsset: initData.getAsset,
                amount: initData.amount,
                minAmount: initData.minAmount,
                percent: initData.percent
            });
        }

        this.name = storage.read().name;

        this.logger = console;
        this.queueEvents = Promise.resolve();
        this.run = false;
    }

    async start() {
        let state = this.storage.read();

        this.sellAsset = await Assets[state.sellAsset];
        this.getAsset = await Assets[state.getAsset];

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
        console.log("checkOrders");

        let ticker = await Apis.db.get_ticker(
                this.getAsset.symbol,
                this.sellAsset.symbol
            ),
            price = BigNumber(ticker.latest),
            needStoploss = price.times(1 - state.percent / 100),
            createOrderPrice = price.times(1 - (state.percent * 2) / 3 / 100),
            stoploss = BigNumber(state.minAmount).div(state.amount);

        console.log(
            price.toNumber(),
            needStoploss.toNumber(),
            createOrderPrice.toNumber(),
            stoploss.toNumber()
        );

        if (needStoploss.gt(stoploss)) {
            console.log("up minAmount");
            state.minAmount = needStoploss.times(state.amount).toNumber();
            this.storage.write(state);
        } else if (createOrderPrice.lt(stoploss)) {
            console.log("create limit order");
            await this.account.sell(
                this.sellAsset.symbol,
                this.getAsset.symbol,
                state.amount,
                stoploss.toNumber()
            );
            this.stop();
        }
    };
}

export default TrailingStop;
