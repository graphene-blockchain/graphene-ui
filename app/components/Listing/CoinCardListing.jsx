import React from "react";

import {DonutChart} from "./DonutChart";
import SendModal from "./DonateSendModal";
import {Icon} from "bitshares-ui-style-guide";

import SettingsStore from "../../stores/SettingsStore";
import {connect} from "alt-react";
import AccountStore from "../../stores/AccountStore";
import Translate from "react-translate-component";
import {Asset} from "../../lib/common/MarketClasses";

class CoinCardListing extends React.Component {
    constructor(props) {
        super(props);

        this.props.coin.votes = 0;
    }

    triggerSend(asset) {
        this.setState({send_asset: asset}, () => {
            if (this.send_modal) this.send_modal.show();
        });
    }

    render() {
        let from_name = "";
        try {
            this.props.account.get("name");
        } catch (e) {}

        let {coin} = this.props;

        return (
            <div className="listingTable__row">
                <SendModal
                    id="send_modal_listing"
                    refCallback={e => {
                        if (e) this.send_modal = e;
                    }}
                    from_name={
                        this.props.currentAccount
                            ? this.props.currentAccount
                            : this.props.account
                    }
                    to_name={coin.account ? coin.account : from_name}
                    asset_id={"1.3.5588"}
                    ticker={coin.ticker}
                />
                <div className="listingAsset">
                    <div className="listingAssetCard">
                        <div className="listingTable__cell listingTableRank align-center">
                            {this.props.rank}
                        </div>
                        <div className="listingTable__cell listingTableLogo">
                            <img
                                className="align-center"
                                style={{maxWidth: 40}}
                                src={`${__BASE_URL__}coins-logo/${coin.ticker.toLowerCase()}.png`}
                                alt=""
                            />
                        </div>
                        <div className="listingTable__cell listingTableAssetName align-left nowrap">
                            {coin.name} ({coin.ticker})
                            {coin.soon === true ? (
                                <Translate
                                    content="listing.table.coming_soon"
                                    style={{float: "right", color: "gold"}}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    <div className="listingAssetInfo">
                        <div className="listingAssetInfoData">
                            <div className="listingTable__cell listingTableGoal">
                                <div className="listingAssetInfoBlock">
                                    <Translate content="listing.table.goal" />
                                    :&nbsp;{" "}
                                </div>
                                {coin.goal}
                            </div>

                            {coin.listed ? (
                                ""
                            ) : (
                                <div className="listingTable__cell listingTableVotes">
                                    <div className="listingAssetInfoBlock">
                                        <Translate content="listing.table.donates" />
                                        :&nbsp;
                                    </div>
                                    {coin.votes}
                                    {coin.soon === true ? (
                                        <a className="coin-soon">
                                            {
                                                <Icon
                                                    name="transfer"
                                                    title="icons.transfer"
                                                    className="icon-14px"
                                                />
                                            }
                                            &nbsp; Donate
                                        </a>
                                    ) : (
                                        <a
                                            onClick={this.triggerSend.bind(
                                                this,
                                                "1.3.5588",
                                                coin
                                            )}
                                        >
                                            {
                                                <Icon
                                                    name="transfer"
                                                    title="icons.transfer"
                                                    className="icon-14px"
                                                />
                                            }
                                            &nbsp; Donate
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="listingTable__cell listingTableStatus">
                                <div className="listingAssetInfoBlock">
                                    <Translate content="listing.table.status" />
                                    :&nbsp;{" "}
                                </div>
                                <Translate
                                    content={"listing.table." + coin.status}
                                />
                            </div>
                        </div>

                        {coin.listed ? (
                            ""
                        ) : (
                            <div className="listingTable__cell listingTableProgress">
                                {
                                    <DonutChart
                                        votes={coin.votes_for_percent}
                                        goal={coin.goal}
                                    />
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

CoinCardListing = connect(
    CoinCardListing,
    {
        listenTo() {
            return [SettingsStore, AccountStore];
        },
        getProps() {
            return {
                settings: SettingsStore.getState().settings,
                currentAccount:
                    AccountStore.getState().currentAccount ||
                    AccountStore.getState().passwordAccount
            };
        }
    }
);

export default CoinCardListing;
