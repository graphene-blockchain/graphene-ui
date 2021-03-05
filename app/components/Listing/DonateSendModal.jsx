import React from "react";
import {SendModal} from "../Modal/SendModal";
import Translate from "react-translate-component";
import AccountStore from "../../stores/AccountStore";
import {connect} from "alt-react";
import {ChainStore} from "bitsharesjs";
import AmountSelector from "../Utility/AmountSelectorStyleGuide";
import AccountSelectorListing from "./AccountSelectorListing";
import FeeAssetSelector from "../Utility/FeeAssetSelector";
import counterpart from "counterpart";
import {isNaN} from "lodash-es";
import {Form, Modal, Button, Tooltip, Input} from "bitshares-ui-style-guide";
import BalanceComponent from "../Utility/BalanceComponent";
import {getWalletName} from "../../branding";
import {Asset} from "../../lib/common/MarketClasses";

class DonateSendModal extends SendModal {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(np) {
        if (np.to_name !== this.state.to_name) {
            this.setState({
                to_name: np.to_name ? np.to_name : "",
                to_account: np.to_name
                    ? ChainStore.getAccount(np.to_name)
                    : null
            });
        }
    }

    render() {
        let {
            propose,
            from_account,
            to_account,
            asset,
            asset_id,
            propose_account,
            feeAmount,
            amount,
            to_name,
            from_name,
            memo,
            balanceError,
            hidden
        } = this.state;
        let from_my_account =
            AccountStore.isMyAccount(from_account) ||
            from_name === this.props.passwordAccount;
        let from_error =
            from_account && !from_my_account && !propose ? true : false;

        let {asset_types} = this._getAvailableAssets();
        let balance = null;

        if (from_account && from_account.get("balances") && !from_error) {
            let account_balances = from_account.get("balances").toJS();
            let _error = this.state.balanceError ? "has-error" : "";
            if (asset_types.length === 1)
                asset = ChainStore.getAsset(asset_types[0]);
            if (asset_types.length > 0) {
                let current_asset_id = asset ? asset.get("id") : asset_types[0];

                balance = (
                    <span>
                        <Translate
                            component="span"
                            content="transfer.available"
                        />
                        :{" "}
                        <span
                            className={_error}
                            style={{
                                borderBottom: "#A09F9F 1px dotted",
                                cursor: "pointer"
                            }}
                            onClick={this._setTotal.bind(
                                this,
                                current_asset_id,
                                account_balances[current_asset_id],
                                feeAmount.getAmount({real: true}),
                                feeAmount.asset_id
                            )}
                        >
                            <BalanceComponent
                                balance={account_balances[current_asset_id]}
                            />
                        </span>
                    </span>
                );
            } else {
                balance = (
                    <span>
                        <span className={_error}>
                            <Translate content="transfer.errors.noFunds" />
                        </span>
                    </span>
                );
            }
        }

        let propose_incomplete = propose && !propose_account;
        const amountValue = parseFloat(
            String.prototype.replace.call(amount, /,/g, "")
        );
        const isAmountValid = amountValue && !isNaN(amountValue);
        const isSubmitNotValid =
            !from_account ||
            !to_account ||
            !isAmountValid ||
            !asset ||
            from_error ||
            propose_incomplete ||
            balanceError ||
            from_account.get("id") == to_account.get("id");

        let tabIndex = this.props.tabIndex; // Continue tabIndex on props count

        return !this.state.open ? null : (
            <div
                id="send_modal_wrapper"
                className={hidden || !this.state.open ? "hide" : ""}
            >
                <Modal
                    visible={this.state.isModalVisible}
                    id={this.props.id}
                    overlay={true}
                    onCancel={this.hideModal}
                    footer={[
                        <Button
                            key={"send"}
                            disabled={isSubmitNotValid}
                            onClick={
                                !isSubmitNotValid
                                    ? this.onSubmit.bind(this)
                                    : null
                            }
                        >
                            {propose
                                ? counterpart.translate("propose")
                                : counterpart.translate("transfer.send")}
                        </Button>,
                        <Button
                            key="Cancel"
                            tabIndex={tabIndex++}
                            onClick={this.onClose}
                        >
                            <Translate
                                component="span"
                                content="transfer.cancel"
                            />
                        </Button>
                    ]}
                >
                    <div className="grid-block vertical no-overflow">
                        <div
                            className="content-block"
                            style={{textAlign: "center", fontSize: "18px"}}
                        >
                            <Translate
                                /*                                content={
                                    !!isSubmitNotValid
                                        ? "listing.modal_header"
                                        : "listing.modal.need_buy_donate"
                                }*/
                                content={"listing.modal.header2"}
                                wallet_name={getWalletName()}
                            />
                            {this.props.ticker}
                        </div>
                        {this.state.open ? (
                            <Form
                                className="full-width-wrapper"
                                layout="vertical"
                            >
                                {
                                    <AccountSelectorListing
                                        label="transfer.from"
                                        accountName={from_name}
                                        account={from_account}
                                        onChange={this.fromChanged.bind(this)}
                                        onAccountChanged={this.onFromAccountChanged.bind(
                                            this
                                        )}
                                        typeahead={true}
                                        tabIndex={tabIndex++}
                                        locked={true}
                                        noForm
                                        //onAction={false}
                                    />
                                }
                                {
                                    <AccountSelectorListing
                                        label="transfer.to"
                                        accountName={to_name}
                                        account={to_account}
                                        onChange={this.toChanged.bind(this)}
                                        onAccountChanged={this.onToAccountChanged.bind(
                                            this
                                        )}
                                        typeahead={true}
                                        tabIndex={tabIndex++}
                                        locked={true}
                                        noForm
                                        //editable={false}
                                    />
                                }
                                <AmountSelector
                                    label="transfer.amount"
                                    amount={amount}
                                    onChange={this.onAmountChanged.bind(this)}
                                    asset={
                                        asset_types.length > 0 && asset
                                            ? asset.get("id")
                                            : asset_id
                                                ? asset_id
                                                : asset_types[0]
                                    }
                                    //assets={asset_types}
                                    display_balance={balance}
                                    tabIndex={tabIndex++}
                                    allowNaN={true}
                                    locked={true}
                                />
                                <FeeAssetSelector
                                    account={from_account}
                                    transaction={{
                                        type: "transfer",
                                        options: ["price_per_kbyte"],
                                        data: {
                                            type: "memo",
                                            content: memo
                                        }
                                    }}
                                    onChange={this.onFeeChanged.bind(this)}
                                    tabIndex={tabIndex++}
                                />
                            </Form>
                        ) : null}
                    </div>
                </Modal>
            </div>
        );
    }
}

class DonateSendModalConnectWrapper extends React.Component {
    render() {
        return <DonateSendModal {...this.props} ref={this.props.refCallback} />;
    }
}

DonateSendModalConnectWrapper = connect(
    DonateSendModalConnectWrapper,
    {
        listenTo() {
            return [AccountStore];
        },
        getProps(props) {
            return {
                currentAccount: AccountStore.getState().currentAccount,
                passwordAccount: AccountStore.getState().passwordAccount,
                tabIndex: props.tabIndex || 0
            };
        }
    }
);

export default DonateSendModalConnectWrapper;
