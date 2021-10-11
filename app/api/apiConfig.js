import {getFaucet, getTestFaucet} from "../branding";

export const openledgerAPIs = {
    BASE: "https://ol-api1.openledger.info/api/v0/ol/support",
    COINS_LIST: "/coins",
    ACTIVE_WALLETS: "/active-wallets",
    TRADING_PAIRS: "/trading-pairs",
    DEPOSIT_LIMIT: "/deposit-limits",
    ESTIMATE_OUTPUT: "/estimate-output-amount",
    ESTIMATE_INPUT: "/estimate-input-amount",
    RPC_URL: "https://openledger.info/api/"
};

export const blockTradesAPIs = {
    BASE: "https://api.blocktrades.us/v2",
    COINS_LIST: "/coins",
    ACTIVE_WALLETS: "/active-wallets",
    TRADING_PAIRS: "/trading-pairs",
    DEPOSIT_LIMIT: "/deposit-limits",
    ESTIMATE_OUTPUT: "/estimate-output-amount",
    ESTIMATE_INPUT: "/estimate-input-amount"
};

export const rudexAPIs = {
    BASE: "https://gateway.rudex.org/api/rudex_new",
    COINS_LIST: "/coins",
    NEW_DEPOSIT_ADDRESS: "/simple-api/initiate-trade"
};

export const nodeRegions = [
    // region of the node follows roughly https://en.wikipedia.org/wiki/Subregion#/media/File:United_Nations_geographical_subregions.png
    "Northern Europe",
    "Western Europe",
    "Southern Europe",
    "Eastern Europe",
    "Northern Asia",
    "Western Asia",
    "Southern Asia",
    "Eastern Asia",
    "Central Asia",
    "Southeastern Asia",
    "Australia and New Zealand",
    "Melanesia",
    "Polynesia",
    "Micronesia",
    "Northern Africa",
    "Western Africa",
    "Middle Africa",
    "Eastern Africa",
    "Southern Africa",
    "Northern America",
    "Central America",
    "Caribbean",
    "South America"
];

export const settingsAPIs = {
    // If you want a location to be translated, add the translation to settings in locale-xx.js
    // and use an object {translate: key} in WS_NODE_LIST
    DEFAULT_WS_NODE: "wss://fake.automatic-selection.com",
    WS_NODE_LIST: [
        {
            url: "wss://node.gph.ai",
            region: "Western Europe",
            country: "Germany",
            location: "Falkenstein",
            operator: "Witness: blckchnd",
            contact: "telegram:blckchnd"
        },
        {
            url: "wss://gph.lexai.host",
            region: "Finland",
            country: "Finland",
            location: "Helsinki",
            operator: "Witness: lex",
            contact: "telegram:LexAi"
        },
        {
            url: "wss://node.graphenelab.io",
            region: "Finland",
            country: "Finland",
            location: "Helsinki",
            operator: "Witness: graphene-lab",
            contact: "telegram:Denis_GL"
        },
        {
            url: "wss://gph-api.xchng.finance",
            region: "Finland",
            country: "Finland",
            location: "Helsinki",
            operator: "Witness: xchng",
            contact: "telegram:Lososeg"
        },
        {
            url: "wss://node.hk.graphene.fans",
            region: "Eastern Asia",
            country: "China",
            location: "Hong-Kong",
            operator: "Witness: traders-witness",
            contact: "telegram:minter_traders"
        }
    ],
    ES_WRAPPER_LIST: [
        {
            url: "https://es-wrapper.gph.ai",
            region: "Western Europe",
            country: "Germany",
            operator: "Witness: blckchnd",
            contact: "telegram:blckchnd"
        }
    ],
    DEFAULT_FAUCET: getFaucet().url,
    TESTNET_FAUCET: getTestFaucet().url
};
