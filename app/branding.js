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
export function getUnits() {
    return ["BTS", "RUBLE", "USD", "CNY", "BTC", "EUR", "GBP"];
}

/**
 * These are the highlighted bases in "My Markets" of the exchange
 *
 * @returns {[string]}
 */

export function getMyMarketsBases() {
    return ["BTS", "RUBLE", "USD", "RUDEX.BTC", "RUDEX.EOS", "CNY"];
}

/**
 * These are the default quotes that are shown after selecting a base
 *
 * @returns {[string]}
 */
export function getMyMarketsQuotes() {
    return [
        "BTS",
        "RUBLE",
        "USD",
        "EUR",
        "CNY",
        "GOLD",
        "SILVER",
        "RUDEX.BTC",
        "RUDEX.ETH",
        "RUDEX.GOLOS",
        "RUDEX.GBG",
        "RUDEX.MUSE",
        "RUDEX.STEEM",
        "RUDEX.SBD",
        "RUDEX.KRM",
        "RUDEX.DCT",
        "RUDEX.TT",
        "RUDEX.SCR",
        "RUDEX.DGB",
        "RUDEX.EOS",
        "PPY",
        "HERTZ",
        "HERO",
        "OBITS",
        "YOYOW",
        "SMOKE",
        "BTWTY",
        "ZEPH",
        "ESCROW.RUBLE",
        "BTC"
    ];
}

/**
 * The featured markets displayed on the landing page of the UI
 *
 * @returns {list of string tuples}
 */
export function getFeaturedMarkets() {
    return [
        ["BTS", "RUBLE"],
        ["RUBLE", "ESCROW.RUBLE"],
        ["BTS", "PPY"],
        ["BTS", "RUDEX.ETH"],
        ["BTS", "RUDEX.BTC"],
        ["BTS", "RUDEX.DGB"],
        ["RUBLE", "RUDEX.GOLOS"],
        ["RUBLE", "RUDEX.GBG"],
        ["BTS", "RUDEX.STEEM"],
        ["BTS", "RUDEX.SBD"],
        ["BTS", "RUDEX.DCT"],
        ["BTS", "RUDEX.KRM"],
        ["BTS", "RUDEX.TT"],
        ["BTS", "RUDEX.SCR"],
        ["BTS", "RUDEX.MUSE"],
        ["BTS", "USD"],
        ["BTS", "EUR"],
        ["BTS", "CNY"],
        ["BTS", "GOLD"],
        ["BTS", "SILVER"],
        ["BTS", "HERO"],
        ["BTS", "OBITS"],
        ["BTS", "SMOKE"],
        ["BTS", "YOYOW"],
        ["CNY", "GDEX.EOS"],
        ["BTS", "BTWTY"],
        ["BTS", "ZEPH"],
        ["BTS", "HERTZ"]
    ];
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
    return gateway in ["OPEN", "RUDEX", "WIN", "BRIDGE", "GDEX"];
}

export function getSupportedLanguages() {
    // not yet supported
}

export function getAllowedLogins() {
    // possible: list containing any combination of ["password", "wallet"]
    return ["password", "wallet"];
}
