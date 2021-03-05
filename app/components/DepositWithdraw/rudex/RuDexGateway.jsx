import React from "react";
import RuDexGatewayDepositRequest from "./RuDexGatewayDepositRequest";
import Translate from "react-translate-component";
import {connect} from "alt-react";
import SettingsStore from "stores/SettingsStore";
import SettingsActions from "actions/SettingsActions";
import AssetImage from "../../Utility/AssetImage";
import {
    RecentTransactions,
    TransactionWrapper
} from "components/Account/RecentTransactions";
import Immutable from "immutable";
import cnames from "classnames";
import LoadingIndicator from "../../LoadingIndicator";

import Select from "react-select";
import "react-select/dist/react-select.css";

class RuDexGateway extends React.Component {
    constructor(props) {
        super();

        this.state = {
            activeCoin: this._getActiveCoin(props, {action: "deposit"}),
            action: props.viewSettings.get("rudexAction", "deposit")
        };
    }

    _getActiveCoin(props, state) {
        let cachedCoin = props.viewSettings.get("activeCoin_rudex", null);
        let firstTimeCoin = "PPY";
        let activeCoin = cachedCoin ? cachedCoin : firstTimeCoin;

        if (state.action === "withdraw") {
            activeCoin = this._findCoinByName(props, activeCoin).symbol;
        }

        return activeCoin;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.provider !== this.props.provider) {
            this.setState({
                activeCoin: this._getActiveCoin(nextProps, this.state.action)
            });
        }
    }

    /*    onSelectCoin(e) {
        this.setState({
            activeCoin: e.target.value
        });

        let setting = {};
        setting[`activeCoin_rudex_${this.state.action}`] = e.target.value;
        SettingsActions.changeViewSetting(setting);
    }*/

    onSelectCoin(e) {
        this.setState({
            activeCoin: e.value
        });

        let setting = {};
        let coinName = e.value;
        if (this.state.action === "withdraw") {
            coinName = this._findCoinBySymbol(this.props, coinName).backingCoin;
        }
        setting["activeCoin_rudex"] = coinName;
        SettingsActions.changeViewSetting(setting);
    }

    _findCoinByName(props, name) {
        for (let i = 0; i < props.coins.length; i++) {
            let coin = props.coins[i];
            if (coin.backingCoin.toUpperCase() === name) return coin;
        }
        return props.coins[0];
    }

    _findCoinBySymbol(props, name) {
        for (let i = 0; i < props.coins.length; i++) {
            let coin = props.coins[i];
            if (coin.symbol.toUpperCase() === name) return coin;
        }
        return null;
    }

    changeAction(type) {
        let activeCoin = this._getActiveCoin(this.props, {action: type});

        this.setState({
            action: type,
            activeCoin: activeCoin
        });

        SettingsActions.changeViewSetting({["rudexAction"]: type});
    }

    render() {
        let {coins, account} = this.props;
        let {activeCoin, action} = this.state;

        if (!coins.length) {
            return <LoadingIndicator />;
        }

        let filteredCoins = coins.filter(a => {
            if (!a || !a.symbol) {
                return false;
            } else {
                return action === "deposit"
                    ? a.depositAllowed
                    : a.withdrawalAllowed;
            }
        });

        let coinOptions = filteredCoins
            .map(coin => {
                let option =
                    action === "deposit"
                        ? coin.backingCoin.toUpperCase()
                        : coin.symbol;

                let name = option.replace("RUDEX.", "");
                let prefix = name === "PPY" ? "" : "RUDEX.";

                return {
                    value: option,
                    label: (
                        <div>
                            <AssetImage
                                replaceNoneToBts={false}
                                maxWidth={30}
                                name={prefix + name}
                            />
                            {option.replace("RUDEX.", "")}
                        </div>
                    )
                };
            })
            .filter(a => {
                return a !== null;
            });

        let coin = filteredCoins.filter(coin => {
            return action === "deposit"
                ? coin.backingCoin.toUpperCase() === activeCoin
                : coin.symbol === activeCoin;
        })[0];

        if (!coin) coin = filteredCoins[0];

        let isDeposit = this.state.action === "deposit";

        let supportUrl = "https://rudex.freshdesk.com";

        return (
            <div style={this.props.style}>
                <div className="grid-block no-margin vertical medium-horizontal no-padding">
                    <div className="medium-4">
                        <div>
                            <label
                                style={{minHeight: "2rem"}}
                                className="left-label"
                            >
                                <Translate
                                    content={"gateway.choose_" + action}
                                />
                                :{" "}
                            </label>
                            <Select
                                //className="external-coin-types bts-select"
                                //onChange={this.onSelectCoin.bind(this)}
                                onChange={this.onSelectCoin.bind(this)}
                                clearable={false}
                                searchable={false}
                                value={activeCoin}
                                options={coinOptions}
                            />

                            {/*</Select>*/}
                        </div>
                    </div>

                    <div className="medium-6 medium-offset-1">
                        <label
                            style={{minHeight: "2rem"}}
                            className="left-label"
                        >
                            <Translate content="gateway.gateway_text" />:
                        </label>
                        <div style={{paddingBottom: 15}}>
                            <ul className="button-group segmented no-margin">
                                <li
                                    className={
                                        action === "deposit" ? "is-active" : ""
                                    }
                                >
                                    <a
                                        onClick={this.changeAction.bind(
                                            this,
                                            "deposit"
                                        )}
                                    >
                                        <Translate content="gateway.deposit" />
                                    </a>
                                </li>
                                <li
                                    className={
                                        action === "withdraw" ? "is-active" : ""
                                    }
                                >
                                    <a
                                        onClick={this.changeAction.bind(
                                            this,
                                            "withdraw"
                                        )}
                                    >
                                        <Translate content="gateway.withdraw" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {!coin ? null : (
                    <div>
                        <div style={{marginBottom: 15}}>
                            <RuDexGatewayDepositRequest
                                key={`${coin.symbol}`}
                                gateway={coin.gatewayWallet}
                                issuer_account={coin.issuer}
                                account={account}
                                deposit_asset={coin.backingCoin.toUpperCase()}
                                deposit_asset_name={coin.name}
                                deposit_coin_type={coin.backingCoin.toLowerCase()}
                                deposit_account={coin.gatewayWallet}
                                deposit_wallet_type={coin.walletType}
                                receive_asset={coin.symbol}
                                receive_coin_type={coin.symbol.toLowerCase()}
                                supports_output_memos={coin.supportsMemos}
                                supportsPublicKey={
                                    coin.supportsPublicKey || false
                                }
                                memoType={coin.memoType}
                                min_amount={coin.minAmount}
                                gateFee={coin.gateFee}
                                asset_precision={coin.precision}
                                confirmations={coin.confirmations}
                                action={this.state.action}
                            />
                            <label className="left-label">Support</label>
                            <div>
                                <Translate content="gateway.rudex.support_block" />
                                <br />
                                <br />
                                <a
                                    href={supportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="external-link"
                                >
                                    {supportUrl}
                                </a>
                            </div>
                        </div>

                        {coin && coin.symbol ? (
                            <TransactionWrapper
                                asset={coin.symbol}
                                fromAccount={
                                    isDeposit
                                        ? coin.issuerId
                                        : this.props.account.get("id")
                                }
                                to={
                                    isDeposit
                                        ? this.props.account.get("id")
                                        : coin.issuerId
                                }
                            >
                                {({asset, to, fromAccount}) => {
                                    return (
                                        <RecentTransactions
                                            accountsList={Immutable.List([
                                                this.props.account.get("id")
                                            ])}
                                            limit={10}
                                            compactView={true}
                                            fullHeight={true}
                                            filter="transfer"
                                            title={
                                                <Translate
                                                    content={
                                                        "gateway.recent_" +
                                                        this.state.action
                                                    }
                                                />
                                            }
                                            customFilter={{
                                                fields: [
                                                    "to",
                                                    "from",
                                                    "asset_id"
                                                ],
                                                values: {
                                                    to: to.get("id"),
                                                    from: fromAccount.get("id"),
                                                    asset_id: asset.get("id")
                                                }
                                            }}
                                        />
                                    );
                                }}
                            </TransactionWrapper>
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    RuDexGateway,
    {
        listenTo() {
            return [SettingsStore];
        },
        getProps() {
            return {
                viewSettings: SettingsStore.getState().viewSettings
            };
        }
    }
);
