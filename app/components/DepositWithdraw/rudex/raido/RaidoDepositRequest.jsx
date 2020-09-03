import React from "react";
import Translate from "react-translate-component";
import {ChainStore} from "bitsharesjs";
import ChainTypes from "components/Utility/ChainTypes";
import BindToChainState from "components/Utility/BindToChainState";
import {requestDepositAddress} from "lib/common/RuDexMethods";
import AccountBalance from "../../../Account/AccountBalance";
import RuDexDepositAddressCache from "common/RuDexDepositAddressCache";
import AssetName from "components/Utility/AssetName";
import LinkToAccountById from "components/Utility/LinkToAccountById";
import PropTypes from "prop-types";

import {availableGateways} from "lib/common/gateways";

//RAIDO
import RaidoPaymentMethod from "./RaidoPaymentMethod";
import "./Raido.css";
import counterpart from "counterpart";

class RaidoDepositRequest extends React.Component {
    static propTypes = {
        gateway: PropTypes.string,
        deposit_coin_type: PropTypes.string,
        deposit_asset_name: PropTypes.string,
        deposit_account: PropTypes.string,
        receive_coin_type: PropTypes.string,
        account: ChainTypes.ChainAccount,
        issuer_account: ChainTypes.ChainAccount,
        deposit_asset: PropTypes.string,
        receive_asset: ChainTypes.ChainAsset,
        deprecated_in_favor_of: ChainTypes.ChainAsset,
        action: PropTypes.string,
        min_amount: PropTypes.number,
        confirmations: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.deposit_address_cache = new RuDexDepositAddressCache();

        this.state = {
            account_name: null,

            receive_address: {
                address: null,
                memo: null
            },

            submitAllowed: false,
            min_max_validate: {
                valid: false,
                direct: "min" //MIN or MAX
            },

            getAmount: 0,
            giveAmount: 0,

            raido: {
                affiliate_id: 10058,

                give_raw: this.props.activePaymentMethod, //fiats
                give: this.props.activePaymentMethod,
                give_decimal: 5,

                //get: "BTC",
                get: this.props.deposit_asset_name,
                get_decimal: 5,

                price: 1,

                in: null,
                out: null,
                in_min_fee: 0,
                withdraw_fee: 0,

                in_fee: 0,
                commission: 0,

                min_deposit: 0,
                max_deposit: 1000000,

                direction: "buy", //BUY or SELL

                currencies: [],
                prices: []
            }
        };

        this.addDepositAddress = this.addDepositAddress.bind(this);
        this._makeUriRaido = this._makeUriRaido.bind(this);

        this._setCoinsRaido = this._setCoinsRaido.bind(this);
        this._setPricesRaido = this._setPricesRaido.bind(this);
        this._initPrices = this._initPrices.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handlePaymentMethod = this.handlePaymentMethod.bind(this);

        this.initCurrencies(this._setCoinsRaido);
    }

    initCurrencies(stateCallback) {
        let coins =
            "https://merchant-datacenter.raidofinance.eu:8095/currencies/";
        fetch(coins, {
            method: "get",
            headers: new Headers({Accept: "application/json"})
        })
            .then(reply => {
                reply.json().then(json => {
                    if (stateCallback) stateCallback(json.data);
                });
            })
            .catch(err => {
                console.log("fetch error:", err);
            });
    }

    _setCoinsRaido(currencies) {
        currencies = currencies.rows;

        let curr_coin_original = this.props.deposit_asset_name;
        let raido = this.state.raido;

        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i].code === curr_coin_original) {
                console.log("withdraw_fee: " + currencies[i].withdraw_fee);

                raido.give = this.state.raido.give;
                raido.get = currencies[i].code;

                raido.currencies = currencies;

                //raido.in_enable = currencies[i].in_enable;//TODO
                raido.out = currencies[i].id;
                raido.min_deposit = currencies[i].min_deposit;
                raido.max_deposit = currencies[i].max_deposit;
                raido.withdraw_fee = currencies[i].withdraw_fee;

                raido.give_decimal = currencies[i].decimal;

                this.setState({raido});
            }
        }
        this._initPrices(this._setPricesRaido);
    }

    _initPrices(stateCallback) {
        let prices = "https://merchant-datacenter.raidofinance.eu:8095/prices/";

        fetch(prices, {
            method: "get",
            headers: new Headers({Accept: "application/json"})
        })
            .then(reply => {
                reply.json().then(json => {
                    if (stateCallback) stateCallback(json.data);
                });
            })
            .catch(err => {
                console.log("fetch error:", err);
            });
    }

    _setPricesRaido(prices) {
        let raido = this.state.raido;
        let currencies = raido.currencies;

        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i].code === raido.give_raw) {
                //if (currencies[i].cur === raido.give_raw) {
                raido.commission = parseFloat(currencies[i].commission);
                raido.in_fee = parseFloat(currencies[i].in_fee);
                raido.in_min_fee = parseFloat(currencies[i].in_min_fee);
                raido.get_decimal = currencies[i].decimal;
                raido.give = currencies[i].cur;
                raido.in = currencies[i].id;

                this.setState({raido});
            }
        }

        let pair = raido.get + "" + raido.give;
        let direction = raido.direction;

        let price = prices[pair][direction];
        console.log("price: " + price);

        if (price) {
            raido.price = price * 1;
            raido.prices = prices;
            this.setState({raido: raido});
        }

        this.handleChange("auto");
    }

    handleChange(type, event) {
        let name, value;

        if (type !== "auto") {
            name = event.target.name;
            value = event.target.value;
        } else {
            //Default properties for toggle static getAmount
            name = "getAmount";
            value = this.state.getAmount;
        }

        if (value === "") {
            this.setState({getAmount: ""});
            this.setState({giveAmount: ""});
            return;
        }

        value = value * 1;

        let raido = this.state.raido;

        let res_getAmount;

        if (name === "giveAmount") {
            res_getAmount =
                value /
                (raido.price /
                    ((100 - (raido.commission + raido.in_fee)) / 100));
            let res_giveAmount = value;

            this.setState({
                getAmount:
                    Math.ceil(
                        (res_getAmount - raido.withdraw_fee * 1) *
                            Math.pow(10, raido.give_decimal)
                    ) / Math.pow(10, raido.give_decimal)
            });
            this.setState({
                giveAmount:
                    Math.ceil(
                        res_giveAmount * Math.pow(10, raido.get_decimal)
                    ) / Math.pow(10, raido.get_decimal)
            });
        } else if (name === "getAmount") {
            res_getAmount = value;
            let res_giveAmount =
                (raido.price * (value + raido.withdraw_fee * 1)) /
                    ((100 - (raido.commission + raido.in_fee)) / 100) +
                raido.in_min_fee;

            this.setState({
                getAmount:
                    Math.ceil(
                        res_getAmount * Math.pow(10, raido.give_decimal)
                    ) / Math.pow(10, raido.give_decimal)
            });
            this.setState({
                giveAmount:
                    Math.ceil(
                        res_giveAmount * Math.pow(10, raido.get_decimal)
                    ) / Math.pow(10, raido.get_decimal)
            });
        }

        if (
            res_getAmount >= raido.min_deposit &&
            (raido.max_deposit == 0 || res_getAmount <= raido.max_deposit)
        ) {
            this.setState({
                min_max_validate: {
                    valid: true,
                    direct: "min" //MIN or MAX
                }
            });
            this.setState({submitAllowed: true});
        } else {
            if (res_getAmount >= raido.min_deposit) {
                this.setState({
                    min_max_validate: {
                        valid: false,
                        direct: "max" //MIN or MAX
                    }
                });
            } else {
                this.setState({
                    min_max_validate: {
                        valid: false,
                        direct: "min" //MIN or MAX
                    }
                });
            }

            this.setState({submitAllowed: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.raido !== this.state.raido ||
            nextProps.deposit_coin_type !== this.props.getAmount ||
            nextState.getAmount !== this.state.getAmount ||
            nextState.giveAmount !== this.state.giveAmount ||
            nextProps.receive_asset !== this.props.receive_asset ||
            nextProps.deposit_asset_name !== this.props.deposit_asset_name ||
            nextProps.action !== this.props.action ||
            nextProps.currentLocale !== this.props.currentLocale
        );
    }

    handlePaymentMethod(e) {
        let payMethod = e.target["name"];
        let str = "paymentmethod";
        payMethod = payMethod
            .substr(str.length + 1, payMethod.length - str.length)
            .toUpperCase();

        let raido = this.state.raido;
        raido.give_raw = payMethod;

        this.setState({raido: raido});

        this._setPricesRaido(this.state.raido.prices);

        let finding_el = document.querySelectorAll("label.btn-radio");
        for (var i = 0; i < finding_el.length; i++) {
            finding_el[i].classList.remove("active");
        }
        e.currentTarget.parentNode.classList.add("active");

        this.props.setActiveRaidoCoin(payMethod);
    }

    _getDepositObject() {
        return {
            inputCoinType: this.props.deposit_coin_type,
            outputCoinType: this.props.receive_coin_type,
            outputAddress: this.props.account.get("name"),
            stateCallback: this.addDepositAddress
        };
    }

    addDepositAddress(receive_address) {
        let account_name = this.props.account.get("name");
        this.deposit_address_cache.cacheInputAddress(
            this.props.gateway,
            account_name,
            this.props.deposit_coin_type,
            this.props.receive_coin_type,
            receive_address.address,
            receive_address.memo
        );
        this.setState({account_name});
        this.setState({receive_address});
    }

    _makeUriRaido() {
        let strUri = "";
        let raido = this.state.raido;
        let receive_address = this.state.receive_address;

        let objParams = {
            affiliate_id: raido.affiliate_id,
            offer_id: 3,
            volume: this.state.giveAmount,
            in: raido.in,
            out: raido.out,
            "out-p": receive_address.address,
            direction: raido.direction
        };
        for (let item in objParams) {
            strUri += "&" + item + "=" + objParams[item];
        }
        return strUri;
    }

    onSubmitRequest(e) {
        e.preventDefault();
        this.setState({error: null});
        let raido_link =
            "https://raidofinance.eu/buy-sell?" + this._makeUriRaido();
        window.open(raido_link, "_blank");
    }

    render() {
        let emptyRow = <div style={{display: "none", minHeight: 150}} />;
        if (
            !this.props.account ||
            !this.props.issuer_account ||
            !this.props.receive_asset
        )
            return emptyRow;

        let account_balances_object = this.props.account.get("balances");

        if (this.props.deprecated_in_favor_of) {
            let has_nonzero_balance = false;
            let balance_object_id = account_balances_object.get(
                this.props.receive_asset.get("id")
            );
            if (balance_object_id) {
                let balance_object = ChainStore.getObject(balance_object_id);
                if (balance_object) {
                    let balance = balance_object.get("balance");
                    if (balance != 0) has_nonzero_balance = true;
                }
            }
            if (!has_nonzero_balance) return emptyRow;
        }

        let receive_address = this.state.receive_address;
        if (this.state.account_name === this.props.account.get("name")) {
            /*            let account_name = this.props.account.get("name");
            receive_address = this.deposit_address_cache.getCachedInputAddress(
                this.props.gateway,
                account_name,
                this.props.deposit_coin_type,
                this.props.receive_coin_type
            );*/
        } else if (!this.props.supports_output_memos) {
            requestDepositAddress(this._getDepositObject());
            return emptyRow;
        }

        let depositConfirmation = null;
        if (this.props.confirmations && this.props.confirmations.type) {
            if (this.props.confirmations.type === "irreversible") {
                depositConfirmation = (
                    <Translate content="gateway.gateway_deposit.confirmations.last_irreversible" />
                );
            } else if (
                this.props.confirmations.type === "blocks" &&
                this.props.confirmations.value
            ) {
                depositConfirmation = (
                    <Translate
                        content="gateway.gateway_deposit.confirmations.n_blocks"
                        blocks={this.props.confirmations.value}
                    />
                );
            }
        }

        let deposit_address_fragment = null;

        let currentGateway = "RUDEX";
        if (
            !!availableGateways[currentGateway].simpleAssetGateway &&
            this.props.deposit_account
        ) {
            deposit_address_fragment = (
                <span>{this.props.deposit_account}</span>
            );
        } else {
            if (
                (!receive_address || !receive_address.address) &&
                !this.props.supportsMemos
            ) {
                requestDepositAddress(this._getDepositObject());
                return emptyRow;
            }
            if (receive_address.memo) {
                deposit_address_fragment = (
                    <span>{receive_address.address}</span>
                );
            } else {
                // This is a client that uses unique deposit addresses to select the output
                deposit_address_fragment = (
                    <span>{receive_address.address}</span>
                );
            }
        }

        if (this.props.action === "deposit") {
            return (
                <div className="rudex__gateway grid-block no-padding no-margin">
                    <div className="small-12 medium-5">
                        <Translate
                            component="h4"
                            content="gateway.rudex.buy_crypto.deposit_summary"
                        />
                        <div className="small-12 medium-10">
                            <table className="table">
                                <tbody>
                                    {/*  <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.asset_to_deposit"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            {this.props.deposit_asset}
                                        </td>
                                    </tr>*/}
                                    {/*  <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.asset_to_receive"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <AssetName
                                                name={this.props.receive_asset.get(
                                                    "symbol"
                                                )}
                                                replace={false}
                                            />
                                        </td>
                                    </tr>*/}
                                    {/*<tr>
                                        <Translate
                                            component="td"
                                            content="gateway.intermediate"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <LinkToAccountById
                                                account={this.props.issuer_account.get(
                                                    "id"
                                                )}
                                            />
                                        </td>
                                    </tr>*/}
                                    <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.your_account"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <LinkToAccountById
                                                account={this.props.account.get(
                                                    "id"
                                                )}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Translate content="gateway.balance" />
                                            :
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <AccountBalance
                                                account={this.props.account.get(
                                                    "name"
                                                )}
                                                asset={this.props.receive_asset.get(
                                                    "symbol"
                                                )}
                                                replace={false}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="small-12 medium-7">
                        <Translate
                            component="h4"
                            content="gateway.rudex.buy_crypto.buy_inst"
                        />

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        ADDRESS:{" "}
                                        <b>{deposit_address_fragment}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {depositConfirmation ? (
                                            <span>
                                                (<i>{depositConfirmation}</i>)
                                            </span>
                                        ) : null}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{padding: "10px 0", fontSize: "1.1rem"}}>
                            <div className="ant-col-24 raido">
                                <div
                                    className="ant-col-24"
                                    style={{
                                        margin: "20px 0"
                                    }}
                                >
                                    <RaidoPaymentMethod
                                        payment_id={"cardu"}
                                        title={"Bank Card (USD)"}
                                        active={this.state.raido.give_raw}
                                        onClick={() => this.handlePaymentMethod}
                                    />

                                    <RaidoPaymentMethod
                                        payment_id={"carde"}
                                        title={"Bank Card (EUR)"}
                                        active={this.state.raido.give_raw}
                                        onClick={() => this.handlePaymentMethod}
                                    />

                                    <RaidoPaymentMethod
                                        payment_id={"wiree"}
                                        title={"Sepa (EUR)"}
                                        active={this.state.raido.give_raw}
                                        onClick={() => this.handlePaymentMethod}
                                    />
                                </div>

                                <div className="ant-col-10 give">
                                    <Translate content="gateway.rudex.buy_crypto.you_give" />
                                    <input
                                        name="giveAmount"
                                        type="number"
                                        value={this.state.giveAmount}
                                        onChange={this.handleChange.bind(
                                            this,
                                            "giveAmount"
                                        )}
                                        placeholder={counterpart.translate(
                                            "gateway.rudex.buy_crypto.you_give"
                                        )}
                                        style={{
                                            backgroundImage: `url(\/images\/raido-payment-${this.state.raido.give_raw.toLowerCase()}.png)`
                                        }}
                                    />
                                </div>

                                <div
                                    className="ant-col-10 get"
                                    style={{marginLeft: "10%"}}
                                >
                                    <Translate content="gateway.rudex.buy_crypto.you_get" />
                                    <input
                                        name="getAmount"
                                        type="number"
                                        value={this.state.getAmount}
                                        onChange={this.handleChange.bind(
                                            this,
                                            "getAmount"
                                        )}
                                        placeholder={counterpart.translate(
                                            "gateway.rudex.buy_crypto.you_get"
                                        )}
                                        style={{
                                            backgroundImage: `url(\/asset-symbols\/rudex.${this.state.raido.get.toLowerCase()}.png)`
                                        }}
                                    />
                                    <span
                                        className={
                                            !this.state.min_max_validate.valid
                                                ? "raido_min_max_validate active"
                                                : "raido_min_max_validate"
                                        }
                                    >
                                        <Translate
                                            content={
                                                "gateway.rudex.buy_crypto." +
                                                this.state.min_max_validate
                                                    .direct +
                                                "_amount"
                                            }
                                        />
                                        {this.state.raido[
                                            this.state.min_max_validate.direct +
                                                "_deposit"
                                        ] * 1}{" "}
                                        {this.state.raido.get}
                                    </span>
                                </div>

                                <div className="ant-col-24">
                                    <div className={"raido_text_block"}>
                                        <Translate
                                            content="gateway.rudex.buy_crypto.withdraw_fee_included"
                                            withdraw_fee={
                                                this.state.raido.withdraw_fee
                                            }
                                            asset={this.state.raido.get}
                                        />
                                    </div>

                                    <div className={"raido_text_block"}>
                                        <Translate content="gateway.rudex.buy_crypto.approximate_amount" />
                                    </div>

                                    <div className={"raido_text_block"}>
                                        <Translate content="gateway.rudex.buy_crypto.final_text" />
                                        <b>{this.props.account.get("name")}</b>
                                    </div>

                                    <div className="ant-col-10 ant-col-offset-6">
                                        <button
                                            className="button"
                                            disabled={!this.state.submitAllowed}
                                            onClick={
                                                this.state.submitAllowed
                                                    ? this.onSubmitRequest.bind(
                                                          this
                                                      )
                                                    : null
                                            }
                                            style={{
                                                marginTop: "15px",
                                                width: "100%"
                                            }}
                                        >
                                            <Translate content="gateway.rudex.buy_crypto.buy" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="rudex__gateway grid-block no-padding no-margin">
                    <div className="small-12 medium-5">
                        <Translate
                            component="h4"
                            content="gateway.withdraw_summary"
                        />
                        <div className="small-12 medium-10">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.asset_to_withdraw"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <AssetName
                                                name={this.props.receive_asset.get(
                                                    "symbol"
                                                )}
                                                replace={false}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.asset_to_receive"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            {this.props.deposit_asset}
                                        </td>
                                    </tr>
                                    <tr>
                                        <Translate
                                            component="td"
                                            content="gateway.intermediate"
                                        />
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <LinkToAccountById
                                                account={this.props.issuer_account.get(
                                                    "id"
                                                )}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Translate content="gateway.balance" />
                                            :
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                color: "#049cce",
                                                textAlign: "right"
                                            }}
                                        >
                                            <AccountBalance
                                                account={this.props.account.get(
                                                    "name"
                                                )}
                                                asset={this.props.receive_asset.get(
                                                    "symbol"
                                                )}
                                                replace={false}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="small-12 medium-7">
                        <Translate
                            component="h4"
                            content="gateway.withdraw_inst"
                        />
                        <label className="left-label">
                            <Translate
                                content="gateway.withdraw_to"
                                asset={this.props.deposit_asset}
                            />
                            :
                        </label>
                        <div
                            className="button-group"
                            style={{paddingTop: 20}}
                        />
                    </div>
                </div>
            );
        }
    }
}

export default BindToChainState(RaidoDepositRequest);
