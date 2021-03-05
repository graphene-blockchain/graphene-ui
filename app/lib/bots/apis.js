import {Apis} from "bitsharesjs-ws";

export default {
    db: new Proxy(Apis, {
        get(apis, method) {
            return function() {
                //console.log(`call Apis.db.${method}(${[...arguments]})`);
                return apis
                    .instance()
                    .db_api()
                    .exec(method, [...arguments]);
            };
        }
    }),

    history: new Proxy(Apis, {
        get(apis, method) {
            return function() {
                return apis
                    .instance()
                    .history_api()
                    .exec(method, [...arguments]);
            };
        }
    }),

    network: new Proxy(Apis, {
        get(apis, method) {
            return function() {
                return apis
                    .instance()
                    .network_api()
                    .exec(method, [...arguments]);
            };
        }
    }),

    crypto: new Proxy(Apis, {
        get(apis, method) {
            return function() {
                return apis
                    .instance()
                    .crypto_api()
                    .exec(method, [...arguments]);
            };
        }
    }),

    orders: new Proxy(Apis, {
        get(apis, method) {
            return function() {
                return apis
                    .instance()
                    .orders_api()
                    .exec(method, [...arguments]);
            };
        }
    })
};
