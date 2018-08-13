import SpreadTrade from "./SpreadTrade";
import RelativeOrders from "./RelativeOrders";
import Storage from "stores/BotsStorage";

var bots = {};

export default {
    strategies: {
        SpreadTrade
        //RelativeOrders
    },

    create(strategy, account, initData) {
        let storage = new Storage(`${account}::${strategy}[${initData.name}]`);

        return new this.strategies[strategy](account, storage, initData);
    },

    delete(account, bot) {
        let index = Object.keys(bots[account]).find(
            key => bots[account][key] === bot
        );
        console.log("index", index);
        if (index) {
            bots[account][index] = undefined;
            bot.delete();
        }
    },

    getBots(account) {
        bots[account] = bots[account] || {};

        return Storage.getAccountBot(account).map(key => {
            if (bots[account][key]) return bots[account][key];

            let [strategy, name] = key
                .replace(/^__bots__(.+)::(\w+)\[(\w+)\]/, "$2,$3")
                .split(",");
            let storage = new Storage(`${account}::${strategy}[${name}]`);

            let bot = new this.strategies[strategy](account, storage);
            bots[account][key] = bot;
            return bot;
        });
    },

    hasBot(account, strategy, name) {
        console.log("check name stategy", account, strategy, name);
        return Storage.has(`${account}::${strategy}[${name}]`);
    }
};
