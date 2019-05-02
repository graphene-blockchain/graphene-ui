import SpreadTrade from "./SpreadTrade";
import TrailingStop from "./TrailingStop";
import PercentUp from "./PercentUp";
//import RelativeOrders from "./RelativeOrders";
import Storage from "stores/BotsStorage";

var bots = {};

export default {
    strategies: {
        SpreadTrade,
        TrailingStop,
        //RelativeOrders,
        PercentUp
    },

    create(strategy, account, initData) {
        let storage = new Storage(`${account}::${strategy}[${initData.name}]`);

        let bot = new this.strategies[strategy](account, storage, initData);
        bots[`__bots__${storage.name}`] = bot;

        return bot;
    },

    delete(bot) {
        let name = `__bots__${bot.storage.name}`;

        bots[name].delete();
        delete bots[name];
    },

    getBots(account) {
        //console.log("getBots", Object.keys(bots))

        return Storage.getAccountBot(account)
            .map(key => {
                if (bots[key]) return bots[key];

                let [strategy, name] = key
                    .replace(/^__bots__(.+)::(\w+)\[(\w+)\]/, "$2,$3")
                    .split(",");

                if (!strategy || !name) return null;

                let storage = new Storage(`${account}::${strategy}[${name}]`);

                let bot = new this.strategies[strategy](account, storage);
                bots[key] = bot;
                return bot;
            })
            .filter(el => el);
    },

    hasBot(account, strategy, name) {
        console.log("check name stategy", account, strategy, name);
        return Storage.has(`${account}::${strategy}[${name}]`);
    }
};
