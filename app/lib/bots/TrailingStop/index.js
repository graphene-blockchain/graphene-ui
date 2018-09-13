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
        this.account = new Account(account, "TEST");
        this.storage = storage;

        if (initData) {
            storage.init({
                name: initData.name,
                sellAsset: initData.sellAsset,
                getAsset: initData.getAsset,
                amount: initData.amount,
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

        this.base = await Assets[state.base.asset];
        this.quote = await Assets[state.quote.asset];

        /*
        if ([this.base.issuer, this.quote.issuer].includes("1.2.0")) {
            if ([this.base.id, this.quote.id].includes("1.3.0"))
                this.getFeed = this.getCoreFeed;
            else if (this.base.issuer == this.quote.issuer)
                this.getFeed = this.getSmartFeed;
            else this.getFeed = this.getUIAFeed;
        } else {
            this.getFeed = this.getUIAFeed;
        }
        */

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

        this.storage.write(state);
    };
}

export default TrailingStop;
