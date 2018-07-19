import React from "react";
import Translate from "react-translate-component";
import ChainTypes from "components/Utility/ChainTypes";
import BindToChainState from "components/Utility/BindToChainState";
import WalletDb from "stores/WalletDb";
import BaseModal from "../../Modal/BaseModal";
import Trigger from "react-foundation-apps/src/trigger";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import AccountBalance from "../../Account/AccountBalance";
import BalanceComponent from "components/Utility/BalanceComponent";
import PropTypes from "prop-types";

var mrktCashLogo = `${__BASE_URL__}images/partner-mrktcash.svg`;

class RuDexFiatDepositWithdrawal extends React.Component {
    static propTypes = {
        account: ChainTypes.ChainAccount
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUnmount() {}

    render() {
        if (!this.props.account) return <div />;

        let markCashLink = (
            <a
                style={{padding: "12px 1.75rem"}}
                href="https://mrkt.cash/?r=102"
                target="_blank"
            >
                <img style={{margin: 0, height: 40}} src={mrktCashLogo} />
            </a>
        );

        return <div>{markCashLink}</div>;

        /*         <table className="table">
                        <thead>
                        <tr>
                            <th><Translate content="gateway.symbol" /></th>
                            <th><Translate content="gateway.deposit_address" /></th>
                            <th><Translate content="gateway.balance" /></th>
                            <th><Translate content="gateway.withdraw" /></th>
                        </tr>
                        </thead>
                        <tbody>
                            <OpenLedgerFiatDepositWithdrawCurrency
                                rpc_url={this.props.rpc_url}
                                account={this.props.account}
                                issuer_account={this.props.issuer_account}
                                deposit_asset="USD"
                                receive_asset="OPEN.USD"
                                deposit_allowed={this.state.allowedFiatCurrencies.deposit.indexOf("USD") > -1}
                                withdraw_allowed={this.state.allowedFiatCurrencies.withdraw.indexOf("USD") > -1}/>
                            <OpenLedgerFiatDepositWithdrawCurrency
                                rpc_url={this.props.rpc_url}
                                account={this.props.account}
                                issuer_account={this.props.issuer_account}
                                deposit_asset="EUR"
                                receive_asset="OPEN.EUR"
                                deposit_allowed={this.state.allowedFiatCurrencies.deposit.indexOf("EUR") > -1}
                                withdraw_allowed={this.state.allowedFiatCurrencies.withdraw.indexOf("EUR") > -1}/>
                            <OpenLedgerFiatDepositWithdrawCurrency
                                rpc_url={this.props.rpc_url}
                                account={this.props.account}
                                issuer_account={this.props.issuer_account}
                                deposit_asset="CNY"
                                receive_asset="OPEN.CNY"
                                deposit_allowed={this.state.allowedFiatCurrencies.deposit.indexOf("CNY") > -1}
                                withdraw_allowed={this.state.allowedFiatCurrencies.withdraw.indexOf("CNY") > -1}/>
                        </tbody>
                    </table>;*/
    }
} // RuDexFiatDepositWithdrawal
RuDexFiatDepositWithdrawal = BindToChainState(RuDexFiatDepositWithdrawal);

export default RuDexFiatDepositWithdrawal;
