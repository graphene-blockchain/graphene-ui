import {Apis} from "bitsharesjs-ws";

/** This file centralized customization and branding efforts throughout the whole wallet and is meant to facilitate
 *  the process.
 *
 *  @author Stefan Schiessl <stefan.schiessl@blockchainprojectsbv.com>
 */

/**
 * Determine if we are running on testnet or mainnet
 * @private
 */
function _isTestnet() {
    const testnet =
        "39f5e2ede1f8bc1a3a54a7914414e3779e33193f1f5693510e73cb7a87617447"; // just for the record
    const mainnet =
        "4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8";

    // treat every other chain as testnet
    return Apis.instance().chain_id !== mainnet;
}

/**
 * Wallet name that is used throughout the UI and also in translations
 * @returns {string}
 */
export function getWalletName() {
    return "RuDEX";
}

/**
 * URL of this wallet
 * @returns {string}
 */
export function getWalletURL() {
    return "https://market.rudex.org";
}

/**
 * Returns faucet information
 *
 * @returns {{url: string, show: boolean}}
 */
export function getFaucet() {
    return {
        url: "https://faucet.rudex.org",
        show: true,
        editable: false,
        referrer: "blckchnd"
    };
}

export function getTestFaucet() {
    // fixme should be solved by introducing _isTestnet into getFaucet and fixing the mess in the Settings when fetching faucet address
    return {
        url: "https://faucet.testnet.bitshares.eu", // operated as a contribution by BitShares EU
        show: true,
        editable: false
    };
}

/**
 * Logo that is used throughout the UI
 * @returns {*}
 */
export function getLogo() {
    return require("assets/logo-ico-blue.png");
}

/**
 * Default set theme for the UI
 * @returns {string}
 */
export function getDefaultTheme() {
    // possible ["darkTheme", "lightTheme", "midnightTheme"]
    return "lightTheme";
}

/**
 * Default login method. Either "password" (for cloud login mode) or "wallet" (for local wallet mode)
 * @returns {string}
 */
export function getDefaultLogin() {
    // possible: one of "password", "wallet"
    return "password";
}

/**
 * Default units used by the UI
 *
 * @returns {[string,string,string,string,string,string]}
 */
export function getUnits() {
    if (_isTestnet()) {
        return ["TEST"];
    }
    return ["BTS", "RUDEX.BTC", "RUDEX.USDT"];
}

export function getDefaultMarket() {
    if (_isTestnet()) {
        return "USD_TEST";
    }
    return "BTS_RUDEX.BTC";
}

/**
 * These are the highlighted bases in "My Markets" of the exchange
 *
 * @returns {[string]}
 */
export function getMyMarketsBases() {
    if (_isTestnet()) {
        return ["TEST"];
    }
    return ["BTS", "RUDEX.USDT", "RUDEX.BTC"];
}

/**
 * These are the default quotes that are shown after selecting a base
 *
 * @returns {[string]}
 */
export function getMyMarketsQuotes() {
    if (_isTestnet()) {
        return ["TEST"];
    }
    let tokens = {
        nativeTokens: [
            //"BTC",
            "BTS"
            //"CNY",
            //"USD",
            //"EUR",
            //"GOLD",
            //"KRW",
            //"RUBLE"
            //"SILVER",
            //"USD"
        ],
        rudexTokens: [
            "PPY",
            "DONATE",
            "RUDEX.BTC",
            "RUDEX.ETH",
            "RUDEX.USDT",
            "RUDEX.EOS",
            "RUDEX.GOLOS",
            "RUDEX.STEEM",
            "RUDEX.WLS",
            "RUDEX.SMOKE",
            "RUDEX.PZM",
            "RUDEX.NBS",

            //RuDEX MPA-s
            "RUDEX.XBS",
            "RUDEX.XBT",
            "RUDEX.RUB",
            "RUDEX.OIL",
            "RUDEX.XAU",

            "RUDEX.LOTTERY"

            //"RUDEX.GRC",
            //"RUDEX.GBG",
            //"RUDEX.SBD",
            //"RUDEX.KRM",
        ],
        otherTokens: []
    };

    let allTokens = [];
    for (let type in tokens) {
        allTokens = allTokens.concat(tokens[type]);
    }
    return allTokens;
}

/**
 * MPA-s for show (order) in Collaterals in Account Portfolio
 * @returns {*}
 */
export function getGroupedMPAsRuDEX() {
    let tokens = {
        //listed: ["EUR", "RUBLE"],
        listed: [],
        rudex: [
            //RuDEX MPA-s
            "RUDEX.XBS",
            "RUDEX.XBT",
            "RUDEX.RUB",
            "RUDEX.OIL",
            "RUDEX.XAU"
        ]
    };

    return tokens;
}

/**
 * The featured markets displayed on the landing page of the UI
 *
 * @returns {list of string tuples}
 */
export function getFeaturedMarkets(quotes = []) {
    if (_isTestnet()) {
        return [["USD", "TEST"]];
    }
    return [
        //BTS
        //["BTS", "EUR"],
        //["BTS", "RUBLE"],
        ["BTS", "RUDEX.XBS"], //MPA

        ["BTS", "PPY"],
        ["BTS", "RUDEX.NBS"],
        ["BTS", "RUDEX.BTC"],
        ["BTS", "RUDEX.USDT"],
        ["BTS", "RUDEX.ETH"],
        ["BTS", "RUDEX.EOS"],
        ["BTS", "RUDEX.GOLOS"],
        ["BTS", "RUDEX.STEEM"],
        ["BTS", "RUDEX.WLS"],
        ["BTS", "RUDEX.SMOKE"], //MPA

        /*["RUBLE", "BTS"],
        ["RUBLE", "PPY"],
        ["RUBLE", "RUDEX.BTC"],
        ["RUBLE", "RUDEX.USDT"],
        ["RUBLE", "RUDEX.ETH"],
        ["RUBLE", "RUDEX.EOS"],
        ["RUBLE", "RUDEX.GOLOS"],
        ["RUBLE", "RUDEX.STEEM"],
        ["RUBLE", "RUDEX.WLS"],
        ["RUBLE", "RUDEX.SMOKE"],
        ["RUBLE", "RUDEX.RUB"], */ //USDT
        ["RUDEX.USDT", "BTS"],
        ["RUDEX.USDT", "PPY"],
        ["RUDEX.USDT", "RUDEX.NBS"],
        ["RUDEX.USDT", "RUDEX.BTC"],
        ["RUDEX.USDT", "RUDEX.ETH"],
        ["RUDEX.USDT", "RUDEX.EOS"],
        ["RUDEX.USDT", "RUDEX.GOLOS"],
        ["RUDEX.USDT", "RUDEX.STEEM"],
        ["RUDEX.USDT", "RUDEX.WLS"],
        ["RUDEX.USDT", "RUDEX.SMOKE"],
        ["RUDEX.USDT", "RUDEX.PZM"],
        //["RUDEX.USDT", "RUBLE"],
        ["RUDEX.USDT", "RUDEX.XBS"], //MPA
        ["RUDEX.USDT", "RUDEX.XBT"], //MPA
        ["RUDEX.USDT", "RUDEX.OIL"], //MPA
        ["RUDEX.USDT", "RUDEX.XAU"], //MPA
        ["RUDEX.USDT", "RUDEX.RUB"], //MPA

        //Bitcoin
        ["RUDEX.BTC", "BTS"],
        ["RUDEX.BTC", "PPY"],
        ["RUDEX.BTC", "RUDEX.NBS"],
        ["RUDEX.BTC", "RUDEX.USDT"],
        ["RUDEX.BTC", "RUDEX.ETH"],
        ["RUDEX.BTC", "RUDEX.EOS"],
        ["RUDEX.BTC", "RUDEX.GOLOS"],
        ["RUDEX.BTC", "RUDEX.STEEM"],
        ["RUDEX.BTC", "RUDEX.WLS"],
        ["RUDEX.BTC", "RUDEX.SMOKE"],
        ["RUDEX.BTC", "DONATE"],
        ["RUDEX.BTC", "RUDEX.LOTTERY"],
        //["RUDEX.BTC", "RUBLE"],
        ["RUDEX.BTC", "RUDEX.XBT"] //MPA
    ].filter(a => {
        if (!quotes.length) return true;
        return quotes.indexOf(a[0]) !== -1;
    });
}

/**
 * Recognized namespaces of assets
 *
 * @returns {[string,string,string,string,string,string,string]}
 */
export function getAssetNamespaces() {
    if (_isTestnet()) {
        return [];
    }
    return [
        "RUDEX.",
        "GDEX.",
        "SPARKDEX.",
        "OPEN.",
        "BRIDGE.",
        "XBTSX.",
        "DEEX."
    ];
}

/**
 * These namespaces will be hidden to the user, this may include "bit" for BitAssets
 * @returns {[string,string]}
 */
export function getAssetHideNamespaces() {
    // e..g "OPEN.", "bit"
    return ["RUDEX."];
}

/**
 * Allowed gateways that the user will be able to choose from in Deposit Withdraw modal
 * @param gateway
 * @returns {boolean}
 */
export function allowedGateway(gateway) {
    const allowedGateways = ["RUDEX"];
    if (!gateway) {
        // answers the question: are any allowed?
        return allowedGateways.length > 0;
    }
    return allowedGateways.indexOf(gateway) >= 0;
}

export function getSupportedLanguages() {
    // not yet supported
}

export function getAllowedLogins() {
    // possible: list containing any combination of ["password", "wallet"]
    return ["password", "wallet"];
}

export function getConfigurationAsset() {
    let assetSymbol = null;
    if (_isTestnet()) {
        assetSymbol = "NOTIFICATIONS";
    } else {
        assetSymbol = "TEST";
    }
    // explanation will be parsed out of the asset description (via split)
    return {
        symbol: assetSymbol,
        explanation:
            "This asset is used for decentralized configuration of the RuDEX UI placed under market.rudex.org."
    };
}

/**
 * The featured coins displayed on the Listing page of the UI
 *
 * @returns {[{[string]:[string]}]}
 */
export function getListingCoins() {
    return [
        //soon: true, (for TON example)
        {
            name: "Monero",
            ticker: "XMR",
            account: "rudex-monero",
            goal: 5000,
            votes: 0
        },
        {
            name: "Litecoin",
            ticker: "LTC",
            account: "rudex-litecoin",
            goal: 5000,
            votes: 0
        },
        {
            name: "Dogecoin",
            ticker: "DOGE",
            account: "rudex-dogecoin",
            goal: 5000,
            votes: 0
        },
        {
            name: "Dash",
            ticker: "DASH",
            account: "rudex-dash",
            goal: 5000,
            votes: 0
        },
        {
            name: "Waves",
            ticker: "WAVES",
            account: "rudex-waves",
            goal: 10000,
            votes: 0
        },
        {
            name: "Telos",
            ticker: "TLOS",
            account: "rudex-telos",
            goal: 5000,
            votes: 0
        },
        {
            name: "Tron",
            ticker: "TRX",
            account: "rudex-tron",
            goal: 10000,
            votes: 0
        },
        {
            name: "Minter Network",
            ticker: "BIP",
            account: "rudex-bip",
            goal: 5000,
            votes: 0
        },
        {
            name: "Neo",
            ticker: "NEO",
            account: "rudex-neo",
            goal: 10000,
            votes: 0
        },
        {
            name: "Idena",
            ticker: "DNA",
            account: "rudex-idena",
            goal: 10000,
            votes: 0
        },
        {
            name: "Zcash",
            ticker: "ZEC",
            account: "rudex-zec",
            goal: 10000,
            votes: 0
        },
        {
            name: "Hive",
            ticker: "HIVE",
            account: "rudex-hive",
            goal: 10000,
            votes: 0
        }
    ];
}

export function getListedCoins() {
    return [
        {
            name: "PRIZM",
            ticker: "PZM",
            account: "rudex-prizm",
            goal: 10000,
            votes: 0
        }
    ];
}
