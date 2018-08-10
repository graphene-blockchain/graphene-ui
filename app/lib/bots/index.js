import SpreadTrade from "./SpreadTrade";
import RelativeOrders from "./RelativeOrders";
import Storage from "stores/BotsStorage";

export default {
    strategies: {
        SpreadTrade,
        RelativeOrders
    },
    Storage,
    account: "",

    create(strategy, account, initData) {
        //console.log("Hello, create function", strategy, account, initData)
        let storage = new Storage(`${account}::${strategy}[${initData.name}]`);

        return new this.strategies[strategy](account, storage, initData);
    },

    getBots(account) {
        return Storage.getAccountBot(account).map(key => {
            let [strategy, name] = key
                .replace(/^__bots__(.+)::(\w+)\[(\w+)\]/, "$2,$3")
                .split(",");
            let storage = new Storage(`${account}::${strategy}[${name}]`);

            return new this.strategies[strategy](account, storage);
        });
    },

    hasBot(account, strategy, name) {
        console.log("check name stategy", account, strategy, name);
        return Storage.has(`${account}::${strategy}[${name}]`);
    }
};
