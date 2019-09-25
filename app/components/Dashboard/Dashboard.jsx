import React from "react";
import Immutable from "immutable";
import DashboardList from "./DashboardList";
import {RecentTransactions} from "../Account/RecentTransactions";
import Translate from "react-translate-component";
import MarketCard from "./MarketCard";
import utils from "common/utils";
import {Apis} from "bitsharesjs-ws";
import LoadingIndicator from "../LoadingIndicator";
import LoginSelector from "../LoginSelector";
import cnames from "classnames";
import SettingsActions from "actions/SettingsActions";
import SettingsStore from "stores/SettingsStore";
import {connect} from "alt-react";
import {getFeaturedMarkets} from "../../branding";

class Dashboard extends React.Component {
    constructor(props) {
        super();
        let marketsByChain = {
            "4018d784": getFeaturedMarkets(),
            "39f5e2ed": [["TEST", "PEG.FAKEUSD"], ["TEST", "BTWTY"]]
        };
        let chainID = Apis.instance().chain_id;
        if (chainID) chainID = chainID.substr(0, 8);

        this.state = {
            width: null,
            showIgnored: false,
            featuredMarkets:
                marketsByChain[chainID] || marketsByChain["4018d784"],
            newAssets: [],
            currentEntry: props.currentEntry
        };

        this._setDimensions = this._setDimensions.bind(this);
        // this._sortMarketsByVolume = this._sortMarketsByVolume.bind(this);
    }

    componentDidMount() {
        this._setDimensions();

        window.addEventListener("resize", this._setDimensions, {
            capture: false,
            passive: true
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !utils.are_equal_shallow(
                nextState.featuredMarkets,
                this.state.featuredMarkets
            ) ||
            !utils.are_equal_shallow(
                nextState.newAssets,
                this.state.newAssets
            ) ||
            nextProps.linkedAccounts !== this.props.linkedAccounts ||
            // nextProps.marketStats !== this.props.marketStats ||
            nextProps.ignoredAccounts !== this.props.ignoredAccounts ||
            nextProps.passwordAccount !== this.props.passwordAccount ||
            nextState.width !== this.state.width ||
            nextProps.accountsReady !== this.props.accountsReady ||
            nextState.showIgnored !== this.state.showIgnored ||
            nextState.currentEntry !== this.state.currentEntry
        );
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._setDimensions);
    }

    _setDimensions() {
        let width = window.innerWidth;

        if (width !== this.state.width) {
            this.setState({width});
        }
    }

    _onToggleIgnored() {
        this.setState({
            showIgnored: !this.state.showIgnored
        });
    }

    _onSwitchType(type) {
        this.setState({
            currentEntry: type
        });
        SettingsActions.changeViewSetting({
            dashboardEntry: type
        });
    }

    render() {
        let {
            linkedAccounts,
            myHiddenAccounts,
            accountsReady,
            passwordAccount
        } = this.props;
        let {
            width,
            showIgnored,
            featuredMarkets,
            newAssets,
            currentEntry
        } = this.state;

        if (passwordAccount && !linkedAccounts.has(passwordAccount)) {
            linkedAccounts = linkedAccounts.add(passwordAccount);
        }
        let names = linkedAccounts.toArray().sort();
        if (passwordAccount && names.indexOf(passwordAccount) === -1)
            names.push(passwordAccount);
        let ignored = myHiddenAccounts.toArray().sort();

        let accountCount =
            linkedAccounts.size +
            myHiddenAccounts.size +
            (passwordAccount ? 1 : 0);

        if (!accountsReady) {
            return <LoadingIndicator />;
        }

        let validMarkets = 0;

        let markets = featuredMarkets
            .map(pair => {
                // HACK: Show all defined markets
                validMarkets++;
                let className = "";
                if (validMarkets > 18) {
                    className += ` show-for-${
                        !accountCount ? "xlarge" : "large"
                    }`;
                } else if (validMarkets > 12) {
                    className += ` show-for-${
                        !accountCount ? "large" : "medium"
                    }`;
                }

                return (
                    <MarketCard
                        key={pair[0] + "_" + pair[1]}
                        marketId={pair[1] + "_" + pair[0]}
                        new={newAssets.indexOf(pair[1]) !== -1}
                        className={className}
                        quote={pair[0]}
                        base={pair[1]}
                        invert={pair[2]}
                        hide={validMarkets > 35}
                    />
                );
            })
            .filter(a => !!a);

        if (!accountCount) {
            return <LoginSelector />;
        }

        const entries = ["accounts", "contacts", "recent"];

        return (
            <div ref="wrapper" className="grid-block vertical">
                <div
                    ref="container"
                    className="grid-container"
                    style={{padding: "2rem 8px"}}
                >
                    {this.props.onlyAccounts ? null : (
                        <div
                            className="block-content-header"
                            style={{marginBottom: 15, paddingTop: 0}}
                        >
                            <Translate content="exchange.featured" />
                        </div>
                    )}
                    {this.props.onlyAccounts ? null : (
                        <div className="grid-block small-up-1 medium-up-3 large-up-4 no-overflow fm-outer-container">
                            {markets}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

let DashboardWrapper = props => {
    return <Dashboard {...props} />;
};

export default (DashboardWrapper = connect(
    DashboardWrapper,
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
));
