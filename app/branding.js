/** This file centralized customization and branding efforts throughout the whole wallet and is meant to facilitate
 *  the process.
 *
 *  @author Stefan Schiessl <stefan.schiessl@blockchainprojectsbv.com>
 */

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
        show: false,
        editable: false
    };
}

/**
 * Logo that is used throughout the UI
 * @returns {*}
 */
export function getLogo() {
    return require("assets/logo-rudex-big.png");
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
export function getUnits(chainId = "4018d784") {
    if (chainId === "4018d784")
        return ["BTS", "RUBLE", "USD", "CNY", "BTC", "EUR", "GBP"];
    else if (chainId === "39f5e2ed") return ["TEST"];
}

/**
 * These are the highlighted bases in "My Markets" of the exchange
 *
 * @returns {[string]}
 */

export function getMyMarketsBases() {
    //return ["BTS", "RUDEX.BTC", "RUDEX.EOS", "RUBLE", "USD", "CNY"];
    return ["BTS", "RUDEX.BTC", "RUDEX.EOS"];
}

/**
 * These are the default quotes that are shown after selecting a base
 *
 * @returns {[string]}
 */
export function getMyMarketsQuotes() {
    let tokens = {
        nativeTokens: [
            //"BTC",
            "BTS"
            ///"CNY",
            //"EUR",
            //"GOLD",
            //"RUBLE",
            //"SILVER",
            //"USD"
        ],
        //bridgeTokens: ["BRIDGE.BCO", "BRIDGE.BTC", "BRIDGE.MONA", "BRIDGE.ZNY"],
        //gdexTokens: ["GDEX.BTC", "GDEX.BTO", "GDEX.EOS", "GDEX.ETH"],
        // openledgerTokens: [
        //     "OBITS",
        //     "OPEN.BTC",
        //     "OPEN.DASH",
        //     "OPEN.DGD",
        //     "OPEN.DOGE",
        //     "OPEN.EOS",
        //     "OPEN.EOSDAC",
        //     "OPEN.ETH",
        //     "OPEN.EURT",
        //     "OPEN.GAME",
        //     "OPEN.GRC",
        //     "OPEN.INCNT",
        //     "OPEN.KRM",
        //     "OPEN.LISK",
        //     "OPEN.LTC",
        //     "OPEN.MAID",
        //     "OPEN.MKR",
        //     "OPEN.NEO",
        //     "OPEN.OMG",
        //     "OPEN.SBD",
        //     "OPEN.STEEM",
        //     "OPEN.TUSD",
        //     "OPEN.USDT",
        //     "OPEN.WAVES",
        //     "OPEN.XMR",
        //     "OPEN.ZEC",
        //     "OPEN.ZRX"
        // ],
        rudexTokens: [
            "RUDEX.BTC",
            "RUDEX.ETH",
            "RUDEX.EOS",
            "PPY",
            "RUDEX.STEEM",
            "RUDEX.SBD",
            "RUDEX.GOLOS",
            "RUDEX.GBG",
            "RUDEX.KRM",
            "RUDEX.GRC",
            "RUDEX.WLS",
            "RUDEX.SMOKE"
        ],
        // winTokens: ["WIN.ETC", "WIN.ETH", "WIN.HSR"],
        //otherTokens: ["HERTZ"]
        otherTokens: []
    };

    let allTokens = [];
    for (let type in tokens) {
        allTokens = allTokens.concat(tokens[type]);
    }
    return allTokens;
}

/**
 * The featured markets displayed on the landing page of the UI
 *
 * @returns {list of string tuples}
 */
export function getFeaturedMarkets(quotes = []) {
    return [
        ["RUDEX.BTC", "RUDEX.EOS"],
        ["RUDEX.BTC", "BTS"],
        ["RUDEX.BTC", "RUDEX.ETH"],
        ["RUDEX.BTC", "PPY"],

        //["BTS", "CNY"],
        //["BTS", "USD"],
        //["BTS", "EUR"],
        //["BTS", "RUBLE"],
        //["BTS", "GOLD"],

        ["BTS", "RUDEX.EOS"],
        ["BTS", "RUDEX.BTC"],
        ["BTS", "RUDEX.ETH"],
        ["BTS", "PPY"],

        ["BTS", "RUDEX.GOLOS"],
        ["RUDEX.BTC", "RUDEX.GOLOS"],
        ["BTS", "RUDEX.GBG"],
        ["RUDEX.BTC", "RUDEX.GBG"],

        //["RUBLE", "RUDEX.GOLOS"],
        //["RUBLE", "RUDEX.GBG"],
        ["BTS", "RUDEX.STEEM"],
        ["RUDEX.BTC", "RUDEX.STEEM"],
        ["BTS", "RUDEX.SBD"],
        ["RUDEX.BTC", "RUDEX.SBD"],

        ["BTS", "RUDEX.KRM"],
        ["BTS", "RUDEX.GRC"],
        ["BTS", "RUDEX.SMOKE"],
        ["BTS", "RUDEX.WLS"]

        //["BTS", "SILVER"],
        //["BTS", "HERTZ"]
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
    return [
        "TRADE.",
        "OPEN.",
        "METAEX.",
        "BRIDGE.",
        "RUDEX.",
        "GDEX.",
        "WIN.",
        "ESCROW."
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
    return ["OPEN", "RUDEX", "GDEX"].indexOf(gateway) >= 0;
}

export function getSupportedLanguages() {
    // not yet supported
}

export function getAllowedLogins() {
    // possible: list containing any combination of ["password", "wallet"]
    return ["password", "wallet"];
}
