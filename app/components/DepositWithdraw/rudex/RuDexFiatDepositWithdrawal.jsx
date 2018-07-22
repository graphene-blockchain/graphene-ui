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

var mrktCashLogo = `${__BASE_URL__}images/partner-mrktcash.png`;

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
                <img style={{margin: 0, height: 80}} src={mrktCashLogo} />
            </a>
        );

        return (
            <div>
                <h1>
                    <Translate content="gateway.rudex.partners.mrktcash.title" />
                </h1>
                <h3>
                    <Translate content="gateway.rudex.partners.mrktcash.description" />
                </h3>
                <p>{markCashLink}</p>
            </div>
        );
    }
} // RuDexFiatDepositWithdrawal
RuDexFiatDepositWithdrawal = BindToChainState(RuDexFiatDepositWithdrawal);

export default RuDexFiatDepositWithdrawal;
