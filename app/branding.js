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
        "7fcf452d6bb058949cdc875b13c8908c8f54b0f264c39faf8152b682af0740ee";

    // treat every other chain as testnet
    return Apis.instance().chain_id !== mainnet;
}

/**
 * Wallet name that is used throughout the UI and also in translations
 * @returns {string}
 */
export function getWalletName() {
    //return "RuDEX";
    return "Graphene";
}

/**
 * URL of this wallet
 * @returns {string}
 */
export function getWalletURL() {
    //return "https://market.rudex.org";
    return "https://wallet.gph.ai";
}

/**
 * Returns faucet information
 *
 * @returns {{url: string, show: boolean}}
 */
export function getFaucet() {
    return {
        url: "https://faucet.gph.ai",
        show: true,
        editable: false,
        referrer: "blckchnd"
    };
}

export function getTestFaucet() {
    // fixme should be solved by introducing _isTestnet into getFaucet and fixing the mess in the Settings when fetching faucet address
    return {
        url: "https://....", // operated as a contribution by Graphene
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
    return ["GPH", "USD", "RUDEX.BTC", "RUDEX.USDT"];
}

export function getDefaultMarket() {
    if (_isTestnet()) {
        return "USD_TEST";
    }
    return "GPH_RUDEX.USDT";
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
    return ["GPH", "RUDEX.BTC", "RUDEX.USDT", "RUDEX.BTS"];
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
            "GPH",
            "USD"

            /* ,
            "EUR",
            "CNY",
            "RUB",

            "BTC",
            "GOLD",
            "SILVER",
            "OIL"*/
        ],
        rudexTokens: [
            "DONATE",

            "RUDEX.BTC",
            "RUDEX.ETH",
            "RUDEX.USDT",
            "RUDEX.EOS",
            "RUDEX.PZM",
            "RUDEX.GOLOS",
            "RUDEX.STEEM",
            "RUDEX.WLS",
            "RUDEX.SMOKE",
            "RUDEX.NBS",
            "RUDEX.PPY",
            "RUDEX.XMR",
            "RUDEX.BTS",
            "RUDEX.TRX"

            //RuDEX MPA-s
            /*
            "RUDEX.XBS",
            "RUDEX.XBT",
            "RUDEX.RUB",
            "RUDEX.OIL",
            "RUDEX.XAU"
            */
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
        //listed: ["USD", "EUR", "CNY", "RUB", "BTC", "GOLD", "SILVER", "OIL"],
        listed: [],
        rudex: [
            //RuDEX MPA-s
            /*            "RUDEX.XBS",
            "RUDEX.XBT",
            "RUDEX.RUB",
            "RUDEX.OIL",
            "RUDEX.XAU"*/
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
        //GPH
        ["GPH", "USD"],

        /*
        ["GPH", "EUR"],
        ["GPH", "CNY"],
        ["GPH", "RUB"],
        ["GPH", "BTC"],
        ["GPH", "GOLD"],
        ["GPH", "SILVER"],
        ["GPH", "OIL"],

        ["USD", "GPH"],
        ["USD", "EUR"],
        ["USD", "CNY"],
        ["USD", "BTC"],
        ["USD", "GOLD"],
        ["USD", "SILVER"],
        ["USD", "OIL"],

        ["RUB", "USD"],
        ["RUB", "GPH"],
        ["RUB", "EUR"],
        ["RUB", "CNY"],
        ["RUB", "BTC"],
        ["RUB", "GOLD"],
        ["RUB", "SILVER"],
        ["RUB", "OIL"]*/

        ["GPH", "RUDEX.PPY"],
        ["GPH", "RUDEX.NBS"],
        ["GPH", "RUDEX.BTC"],
        ["GPH", "RUDEX.USDT"],
        ["GPH", "RUDEX.ETH"],
        ["GPH", "RUDEX.XMR"],
        ["GPH", "RUDEX.EOS"],
        ["GPH", "RUDEX.GOLOS"],
        ["GPH", "RUDEX.STEEM"],
        ["GPH", "RUDEX.WLS"],
        //["GPH", "RUDEX.SMOKE"], delisted
        ["GPH", "RUDEX.BTS"],
        ["GPH", "RUDEX.TRX"],

        /*["RUBLE", "GPH"],
        ["RUBLE", "RUDEX.PPY"],
        ["RUBLE", "RUDEX.BTC"],
        ["RUBLE", "RUDEX.USDT"],
        ["RUBLE", "RUDEX.ETH"],
        ["RUBLE", "RUDEX.EOS"],
        ["RUBLE", "RUDEX.GOLOS"],
        ["RUBLE", "RUDEX.STEEM"],
        ["RUBLE", "RUDEX.WLS"],
        ["RUBLE", "RUDEX.SMOKE"], delisted
        ["RUBLE", "RUDEX.RUB"], */

        ["RUDEX.USDT", "GPH"],
        ["RUDEX.USDT", "USD"],

        ["RUDEX.USDT", "DONATE"],
        ["RUDEX.USDT", "RUDEX.PPY"],
        ["RUDEX.USDT", "RUDEX.NBS"],
        ["RUDEX.USDT", "RUDEX.BTC"],
        ["RUDEX.USDT", "RUDEX.ETH"],
        ["RUDEX.USDT", "RUDEX.EOS"],
        ["RUDEX.USDT", "RUDEX.GOLOS"],
        ["RUDEX.USDT", "RUDEX.STEEM"],
        ["RUDEX.USDT", "RUDEX.WLS"],
        //["RUDEX.USDT", "RUDEX.SMOKE"], delisted
        ["RUDEX.USDT", "RUDEX.PZM"],
        ["RUDEX.USDT", "RUDEX.XMR"],
        ["RUDEX.USDT", "RUDEX.BTS"],
        ["RUDEX.USDT", "RUDEX.TRX"],
        //["RUDEX.USDT", "RUBLE"],

        /*        ["RUDEX.USDT", "RUDEX.XBS"], //MPA
        ["RUDEX.USDT", "RUDEX.XBT"], //MPA
        ["RUDEX.USDT", "RUDEX.OIL"], //MPA
        ["RUDEX.USDT", "RUDEX.XAU"], //MPA
        ["RUDEX.USDT", "RUDEX.RUB"], //MPA*/

        //Bitcoin
        //["RUDEX.BTC", "DONATE"],

        ["RUDEX.BTC", "GPH"],
        ["RUDEX.BTC", "RUDEX.PPY"],
        //["RUDEX.BTC", "RUDEX.NBS"],
        ["RUDEX.BTC", "RUDEX.ETH"],
        ["RUDEX.BTC", "RUDEX.XMR"],
        ["RUDEX.BTC", "RUDEX.EOS"],
        ["RUDEX.BTC", "RUDEX.GOLOS"],
        ["RUDEX.BTC", "RUDEX.STEEM"],
        //["RUDEX.BTC", "RUDEX.WLS"],
        //["RUDEX.BTC", "RUDEX.SMOKE"], delisted
        ["RUDEX.BTC", "RUDEX.BTS"],
        ["RUDEX.BTC", "RUDEX.TRX"],

        //["RUDEX.BTC", "RUDEX.LOTTERY"],
        //["RUDEX.BTC", "RUBLE"],
        //["RUDEX.BTC", "RUDEX.XBT"] //MPA

        //Bitshares
        ["RUDEX.BTS", "GPH"],
        ["RUDEX.BTS", "RUDEX.PPY"],
        ["RUDEX.BTS", "RUDEX.NBS"],
        ["RUDEX.BTS", "RUDEX.BTC"],
        ["RUDEX.BTS", "RUDEX.USDT"],
        ["RUDEX.BTS", "RUDEX.ETH"],
        ["RUDEX.BTS", "RUDEX.XMR"],
        ["RUDEX.BTS", "RUDEX.EOS"],
        ["RUDEX.BTS", "RUDEX.GOLOS"],
        ["RUDEX.BTS", "RUDEX.STEEM"],
        ["RUDEX.BTS", "RUDEX.WLS"],
        //["RUDEX.BTS", "RUDEX.SMOKE"], delisted
        ["RUDEX.BTS", "RUDEX.TRX"]
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
    return ["RUDEX."];
}

/**
 * These namespaces will be hidden to the user, this may include "bit" for gpAssets
 * @returns {[string,string]}
 */
export function getAssetHideNamespaces() {
    // e..g "OPEN.", "bit"
    //return ["RUDEX."];
    return [];
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
        assetSymbol = "RUDEX";
    }
    // explanation will be parsed out of the asset description (via split)
    return {
        symbol: assetSymbol,
        explanation:
            "This asset is used for decentralized configuration of the RuDEX UI placed under https://market.rudex.org/."
    };
}

/**
 * The featured coins displayed on the Listing page of the UI
 *
 * @returns {[{[string]:[string]}]}
 */
export function getListingCoins() {
    return [];
}

export function getListedCoins() {
    return [];
}
