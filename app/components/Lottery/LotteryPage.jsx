import React from "react";
import "./LotteryPage.css";

import {Apis} from "bitsharesjs-ws";
import {FetchChain} from "bitsharesjs";

import {Tabs, Tab} from "../Utility/Tabs";
import AssetImage from "../Utility/AssetImage";
import Translate from "react-translate-component";
import {Button} from "bitshares-ui-style-guide";
import {Link} from "react-router-dom";
import SettingsStore from "stores/SettingsStore";

//======
import SendModal from "./LotterySendModal";
import {Icon} from "bitshares-ui-style-guide";

import AccountStore from "../../stores/AccountStore";
import {connect} from "alt-react";

class LotteryPage extends React.Component {
    constructor() {
        super();
        this.state = {
            uri: "https://lottery.rudex.org/api/lottery/",
            LotteryNotice1Informed: false,
            updating: true,

            common_stat: {},
            my_stat: {},
            my_stat_details: []
        };

        this._setCommonStat = this._setCommonStat.bind(this);
        this._setMyStat = this._setMyStat.bind(this);
        this._setMyStatDetails = this._setMyStatDetails.bind(this);
    }

    onLotteryNotice1Informed() {
        this.setState({
            LotteryNotice1Informed: !this.state.LotteryNotice1Informed
        });
    }

    componentDidMount() {
        setInterval(
            () =>
                this._getStats(
                    this._setCommonStat,
                    this._setMyStat,
                    this._setMyStatDetails
                ),
            5000
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.updating == false) return true;
        return false;
    }

    triggerSend(asset) {
        this.setState({send_asset: asset}, () => {
            if (this.send_modal) this.send_modal.show();
        });
    }

    _setCommonStat(data) {
        let common_stat = data;
        this.setState({common_stat});
    }

    _setMyStat(data) {
        let my_stat = data;
        this.setState({my_stat});
    }

    _setMyStatDetails(data) {
        let my_stat_details = data;
        this.setState({my_stat_details});
    }

    render() {
        return (
            <div className="grid-block vertical">
                <div className="listingTable__row">
                    <SendModal
                        id="send_modal_listing"
                        refCallback={e => {
                            if (e) this.send_modal = e;
                        }}
                        from_name={this.props.currentAccount}
                        to_name={"rudex-lottery"}
                        asset_id={"1.3.5878"}
                    />
                </div>

                {/*Tabs*/}
                <div className="grid-content">
                    <div className="content-block small-12">
                        <div className="tabs-container generic-bordered-box">
                            <label
                                className="horizontal"
                                style={{backgroundColor: "white"}}
                            >
                                <div
                                    className="grid-container"
                                    style={{padding: "2rem 8px"}}
                                >
                                    <div style={{marginBottom: 20}} />
                                    <div className="grid-block small-up-1 medium-up-1 large-up-1 no-overflow">
                                        {this.state.updating === true ? (
                                            <div style={{margin: "10px"}}>
                                                <Translate content="lottery.loading" />{" "}
                                            </div>
                                        ) : (
                                            this.getContent()
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _getStats(stateCallback1, stateCallback2, stateCallback3) {
        this.setState({
            updating: true
        });

        let uri1 = this.state.uri + "stats";
        fetch(uri1, {
            method: "get"
        })
            .then(reply => {
                let reply1 = reply;

                let uri2 =
                    this.state.uri + "account/" + this.props.currentAccount;

                fetch(uri2, {
                    method: "get"
                })
                    .then(reply => {
                        reply.json().then(json => {
                            if (stateCallback2) stateCallback2(json.stats);
                            if (stateCallback3) stateCallback3(json.details);
                        });

                        reply1.json().then(json => {
                            if (stateCallback1) stateCallback1(json.stats);
                        });

                        this.setState({
                            updating: false
                        });
                    })
                    .catch(err => {
                        console.log("fetch error:", err);
                    });
            })
            .catch(err => {
                console.log("fetch error:", err);
            });
    }

    getContent = () => {
        return (
            <div className="lotteryTable">
                <p>
                    <Link
                        style={{margin: 2, fontSize: "1.0rem"}}
                        to={"/market/RUDEX.LOTTERY_RUDEX.BTC"}
                    >
                        <Translate content="lottery.buy" />

                        <span style={{margin: 2, fontSize: "1.0rem"}}>
                            <AssetImage
                                maxWidth={25}
                                replaceNoneToBts={false}
                                name={"RUDEX.LOTTERY"}
                            />
                            LOTTERY
                        </span>
                    </Link>
                </p>

                <table className={"lotteryTable"}>
                    <tbody>
                        <tr>
                            <td>
                                <div className={"lotteryBlock"}>
                                    <Translate content="lottery.text.main" />
                                </div>
                            </td>
                            <td>
                                <div className={"lotteryBlock"}>
                                    <Translate content="lottery.all_stat.main" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ol>
                                    <li>
                                        <Translate content="lottery.text.block_1" />
                                        <a
                                            style={{
                                                padding: "0.5rem",
                                                lineHeight: "2rem",
                                                fontSize: "1em"
                                            }}
                                            href="https://gph.ai"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GPH
                                        </a>
                                        <Translate content="lottery.text.block_11" />
                                        <Translate content="lottery.text.block_12" />
                                        <Link
                                            style={{
                                                margin: 2,
                                                fontSize: "1.0rem"
                                            }}
                                            to={
                                                "/market/RUDEX.LOTTERY_RUDEX.BTC"
                                            }
                                        >
                                            <span
                                                style={{
                                                    margin: 2,
                                                    fontSize: "1.0rem"
                                                }}
                                            >
                                                <AssetImage
                                                    maxWidth={25}
                                                    replaceNoneToBts={false}
                                                    name={"RUDEX.LOTTERY"}
                                                />
                                                LOTTERY/BTC
                                            </span>
                                        </Link>
                                        .
                                        <Translate content="lottery.text.block_13" />
                                        <br />
                                        <a
                                            style={{
                                                padding: "0.5rem",
                                                lineHeight: "2rem",
                                                fontSize: "1em"
                                            }}
                                            href="https://gph.ai"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Translate content="lottery.more" />
                                        </a>
                                    </li>

                                    <li>
                                        <Translate content="lottery.text.block_2" />
                                    </li>
                                    <li>
                                        <Translate content="lottery.text.block_3" />
                                    </li>
                                    <li>
                                        <a
                                            onClick={this.triggerSend.bind(
                                                this,
                                                "1.3.5878",
                                                "RUDEX.LOTTERY"
                                            )}
                                        >
                                            &nbsp;{" "}
                                            <Translate content="lottery.reg" />
                                        </a>
                                    </li>
                                </ol>
                            </td>

                            <td>
                                <ul>
                                    <li>
                                        <Translate content="lottery.all_stat.regs_all" />{" "}
                                        {this.state.common_stat.tickets}
                                    </li>
                                    <li>
                                        <Translate content="lottery.all_stat.win_all" />{" "}
                                        {this.state.common_stat.tokens}
                                    </li>
                                    <li>
                                        <Translate content="lottery.all_stat.try" />{" "}
                                        {this.state.common_stat.purchase_total}
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className={"lotteryTable"} style={{width: "50%"}}>
                    <tbody>
                        <tr>
                            <td>
                                <div className={"lotteryBlock"}>
                                    <Translate content="lottery.my_stat.main" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <li>
                                        <Translate content="lottery.my_stat.regs_all" />{" "}
                                        {this.state.my_stat.tickets}
                                    </li>
                                    <li>
                                        <Translate content="lottery.my_stat.win_all" />{" "}
                                        {this.state.my_stat.tokens}
                                    </li>
                                    <li>
                                        <Translate content="lottery.my_stat.try" />{" "}
                                        {this.state.my_stat.purchase_total}
                                    </li>
                                </ul>

                                <div className={"accDetails"}>
                                    <Translate content="lottery.details.main" />
                                </div>
                                {this.getMyHistoryDetails()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    getMyHistoryDetails = () => {
        let details = this.state.my_stat_details;
        return details.map((item, index) => {
            return (
                <div key={index}>
                    <ul style={{listStyleType: "square"}}>
                        <li>operationId {item.operationId}</li>
                        <li>
                            <Translate content="lottery.details.trx" />{" "}
                            <a
                                href={"https://bts.ai/tx/" + item.trx_id}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.trx_id}
                            </a>
                        </li>
                        <li>
                            <Translate content="lottery.details.num_blocks" />{" "}
                            <a
                                href={
                                    "https://bts.ai/block/" + item.blocknumber
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.blocknumber}
                            </a>
                        </li>
                        <li>
                            <Translate content="lottery.details.tickets" />{" "}
                            {item.tickets}
                        </li>
                        <li>
                            <Translate content="lottery.details.tokens" />{" "}
                            {item.tokens}
                        </li>
                        <li>
                            <Translate content="lottery.details.start" />{" "}
                            {item.random_start}
                        </li>
                    </ul>
                    <hr />
                </div>
            );
        });
    };
}

LotteryPage = connect(
    LotteryPage,
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

export default LotteryPage;
