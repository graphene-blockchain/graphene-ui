import React from "react";
import {connect} from "alt-react";
import accountUtils from "common/account_utils";
import {updateGatewayBackers} from "common/gatewayUtils";
import utils from "common/utils";
import Translate from "react-translate-component";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
//import OpenledgerGateway from "../DepositWithdraw/OpenledgerGateway";
//import OpenLedgerFiatDepositWithdrawal from "../DepositWithdraw/openledger/OpenLedgerFiatDepositWithdrawal";
//import OpenLedgerFiatTransactionHistory from "../DepositWithdraw/openledger/OpenLedgerFiatTransactionHistory";
//import BlockTradesBridgeDepositRequest from "../DepositWithdraw/blocktrades/BlockTradesBridgeDepositRequest";
//import CitadelBridgeDepositRequest from "../DepositWithdraw/citadel/CitadelBridgeDepositRequest";
import HelpContent from "../Utility/HelpContent";
import AccountStore from "stores/AccountStore";
import SettingsStore from "stores/SettingsStore";
import SettingsActions from "actions/SettingsActions";
import RuDexGateway from "../DepositWithdraw/rudex/RuDexGateway";
import RaidoFinance from "../DepositWithdraw/rudex/raido/RaidoFinance";
import GatewayStore from "stores/GatewayStore";
import AccountImage from "../Account/AccountImage";

import PropTypes from "prop-types";
import DepositModal from "../Modal/DepositModal";
import WithdrawModal from "../Modal/WithdrawModalNew";
import TranslateWithLinks from "../Utility/TranslateWithLinks";

class AccountDepositWithdraw extends React.Component {
    static propTypes = {
        account: ChainTypes.ChainAccount.isRequired,
        contained: PropTypes.bool
    };

    static defaultProps = {
        contained: false
    };

    constructor(props) {
        super();
        this.state = {
            olService: props.viewSettings.get("olService", "gateway"),
            rudexService: props.viewSettings.get("rudexService", "gateway"),
            bitsparkService: props.viewSettings.get(
                "bitsparkService",
                "gateway"
            ),
            xbtsxService: props.viewSettings.get("xbtsxService", "gateway"),
            btService: props.viewSettings.get("btService", "bridge"),
            citadelService: props.viewSettings.get("citadelService", "bridge"),
            metaService: props.viewSettings.get("metaService", "bridge"),
            activeService: props.viewSettings.get("activeService", 0),

            RudexNotice1Informed: false,
            RudexNotice1Informed_BuyCrypto: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.account !== this.props.account ||
            nextProps.servicesDown !== this.props.servicesDown ||
            !utils.are_equal_shallow(
                nextProps.blockTradesBackedCoins,
                this.props.blockTradesBackedCoins
            ) ||
            !utils.are_equal_shallow(
                nextProps.openLedgerBackedCoins,
                this.props.openLedgerBackedCoins
            ) ||
            !utils.are_equal_shallow(
                nextProps.citadelBackedCoins,
                this.props.citadelBackedCoins
            ) ||
            nextState.olService !== this.state.olService ||
            nextState.rudexService !== this.state.rudexService ||
            nextState.bitsparkService !== this.state.bitsparkService ||
            nextState.xbtsxService !== this.state.xbtsxService ||
            nextState.btService !== this.state.btService ||
            nextState.citadelService !== this.state.citadelService ||
            nextState.metaService !== this.state.metaService ||
            nextState.activeService !== this.state.activeService ||
            nextState.RudexNotice1Informed !==
                this.state.RudexNotice1Informed ||
            nextState.RudexNotice1Informed_BuyCrypto !==
                this.state.RudexNotice1Informed_BuyCrypto ||
            nextProps.currentLocale !== this.props.currentLocale
        );
    }

    componentWillMount() {
        accountUtils.getFinalFeeAsset(this.props.account, "transfer");
    }

    toggleOLService(service) {
        this.setState({
            olService: service
        });

        SettingsActions.changeViewSetting({
            olService: service
        });
    }

    onRudexNotice1Informed() {
        this.setState({
            RudexNotice1Informed: !this.state.RudexNotice1Informed
        });
    }

    onRudexNotice1Informed_BuyCrypto() {
        this.setState({
            RudexNotice1Informed_BuyCrypto: !this.state
                .RudexNotice1Informed_BuyCrypto
        });
    }

    toggleRuDEXService(service) {
        this.setState({
            rudexService: service
        });

        SettingsActions.changeViewSetting({
            rudexService: service
        });
    }

    toggleXbtsxService(service) {
        this.setState({
            xbtsxService: service
        });

        SettingsActions.changeViewSetting({
            xbtsxService: service
        });
    }

    toggleBitSparkService(service) {
        this.setState({
            bitsparkService: service
        });

        SettingsActions.changeViewSetting({
            bitsparkService: service
        });
    }

    toggleBTService(service) {
        this.setState({
            btService: service
        });

        SettingsActions.changeViewSetting({
            btService: service
        });
    }

    toggleCitadelService(service) {
        this.setState({
            citadelService: service
        });
        SettingsActions.changeViewSetting({
            citadelService: service
        });
    }

    toggleMetaService(service) {
        this.setState({
            metaService: service
        });

        SettingsActions.changeViewSetting({
            metaService: service
        });
    }

    onSetService(e) {
        //let index = this.state.services.indexOf(e.target.value);
        this.setState({
            activeService: parseInt(e.target.value)
        });

        SettingsActions.changeViewSetting({
            activeService: parseInt(e.target.value)
        });
    }

    renderServices(rudexGatewayCoins) {
        //let services = ["Openledger (OPEN.X)", "BlockTrades (TRADE.X)", "Transwiser", "BitKapital"];
        let serList = [];
        let {account} = this.props;
        let {
            rudexService,
            RudexNotice1Informed,
            RudexNotice1Informed_BuyCrypto
        } = this.state;

        let agreement_ru =
            "https://rudex.freshdesk.com/support/solutions/articles/35000138247-cоглашение-об-оказании-услуг-шлюза";
        let agreement_en =
            "https://rudex.freshdesk.com/support/solutions/articles/35000138245-gateway-service-agreement";

        serList.push({
            name: "RuDEX (RUDEX.X)",
            identifier: "RUDEX",
            template: (
                <div className="content-block">
                    <div
                        className="service-selector"
                        style={{marginBottom: "2rem"}}
                    >
                        <ul className="button-group segmented no-margin">
                            <li
                                onClick={this.toggleRuDEXService.bind(
                                    this,
                                    "gateway"
                                )}
                                className={
                                    rudexService === "gateway"
                                        ? "is-active"
                                        : ""
                                }
                            >
                                <a>
                                    <Translate content="gateway.gateway" />
                                </a>
                            </li>
                            <li
                                onClick={this.toggleRuDEXService.bind(
                                    this,
                                    "fiat"
                                )}
                                className={
                                    rudexService === "fiat" ? "is-active" : ""
                                }
                            >
                                <a>
                                    {
                                        <Translate content="gateway.rudex.buy_crypto.title" />
                                    }
                                    <img
                                        style={{width: "30px"}}
                                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMTAzMDYiCiAgIHZpZXdCb3g9IjAgMCA1MDAuMDAwMDEgMTYyLjgxNTk0IgogICA+CiAgPGRlZnMKICAgICBpZD0iZGVmczEwMzA4Ij4KICAgIDxjbGlwUGF0aAogICAgICAgaWQ9ImNsaXBQYXRoMTAyNzEiCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoMTAyNzMiCiAgICAgICAgIGQ9Im0gNDEzLjc0Miw5MC40MzUgYyAtMC4wNTcsLTQuNDk0IDQuMDA1LC03LjAwMiA3LjA2NSwtOC40OTMgMy4xNDQsLTEuNTMgNC4yLC0yLjUxMSA0LjE4OCwtMy44NzkgLTAuMDI0LC0yLjA5NCAtMi41MDgsLTMuMDE4IC00LjgzMywtMy4wNTQgLTQuMDU2LC0wLjA2MyAtNi40MTQsMS4wOTUgLTguMjg5LDEuOTcxIGwgLTEuNDYxLC02LjgzNyBjIDEuODgxLC0wLjg2NyA1LjM2NCwtMS42MjMgOC45NzYsLTEuNjU2IDguNDc4LDAgMTQuMDI1LDQuMTg1IDE0LjA1NSwxMC42NzQgMC4wMzMsOC4yMzUgLTExLjM5MSw4LjY5MSAtMTEuMzEzLDEyLjM3MiAwLjAyNywxLjExNiAxLjA5MiwyLjMwNyAzLjQyNiwyLjYxIDEuMTU1LDAuMTUzIDQuMzQ0LDAuMjcgNy45NTksLTEuMzk1IGwgMS40MTksNi42MTUgYyAtMS45NDQsMC43MDggLTQuNDQzLDEuMzg2IC03LjU1NCwxLjM4NiAtNy45OCwwIC0xMy41OTMsLTQuMjQyIC0xMy42MzgsLTEwLjMxNCBtIDM0LjgyNyw5Ljc0NCBjIC0xLjU0OCwwIC0yLjg1MywtMC45MDMgLTMuNDM1LC0yLjI4OSBsIC0xMi4xMTEsLTI4LjkxNyA4LjQ3MiwwIDEuNjg2LDQuNjU5IDEwLjM1MywwIDAuOTc4LC00LjY1OSA3LjQ2NywwIC02LjUxNiwzMS4yMDYgLTYuODk0LDAgbSAxLjE4NSwtOC40MyAyLjQ0NSwtMTEuNzE4IC02LjY5NiwwIDQuMjUxLDExLjcxOCBtIC00Ni4yODQsOC40MyAtNi42NzgsLTMxLjIwNiA4LjA3MywwIDYuNjc1LDMxLjIwNiAtOC4wNywwIG0gLTExLjk0MywwIC04LjQwMywtMjEuMjQgLTMuMzk5LDE4LjA2IGMgLTAuMzk5LDIuMDE2IC0xLjk3NCwzLjE4IC0zLjcyMywzLjE4IGwgLTEzLjczNywwIC0wLjE5MiwtMC45MDYgYyAyLjgyLC0wLjYxMiA2LjAyNCwtMS41OTkgNy45NjUsLTIuNjU1IDEuMTg4LC0wLjY0NSAxLjUyNywtMS4yMDkgMS45MTcsLTIuNzQyIGwgNi40MzgsLTI0LjkwMyA4LjUzMiwwIDEzLjA4LDMxLjIwNiAtOC40NzgsMCIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDEwMjc3IgogICAgICAgc3ByZWFkTWV0aG9kPSJwYWQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDg0LjE5OTUsMzEuMDA4OCwzMS4wMDg4LC04NC4xOTk1LDE5LjUxMiwtMjcuNDE5MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIHkyPSIwIgogICAgICAgeDI9IjEiCiAgICAgICB5MT0iMCIKICAgICAgIHgxPSIwIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3AxMDI3OSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMjIyMzU3IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDEwMjgxIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMyNTRhYTUiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExMDMxMSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzMzLjcwMTU3LC01MzYuNDI0MzEpIgogICAgIGlkPSJsYXllcjEiPgogICAgPGcKICAgICAgIGlkPSJnMTAyNjciCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCg0Ljk4NDY4NTYsMCwwLC00Ljk4NDY4NTYsLTE0NzAuMTE4NSwxMDM5LjYyNjQpIj4KICAgICAgPGcKICAgICAgICAgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoMTAyNzEpIgogICAgICAgICBpZD0iZzEwMjY5Ij4KICAgICAgICA8ZwogICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1MS42MTEsOTYuODk2KSIKICAgICAgICAgICBpZD0iZzEwMjc1Ij4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBpZD0icGF0aDEwMjgzIgogICAgICAgICAgICAgc3R5bGU9ImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDEwMjc3KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIKICAgICAgICAgICAgIGQ9Ik0gMCwwIDk4LjQzNywzNi4yNTIgMTIwLjgzMSwtMjQuNTU3IDIyLjM5NSwtNjAuODA5IiAvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
                                    />
                                    <img
                                        style={{
                                            width: "20px",
                                            margin: "0 10px 0"
                                        }}
                                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmlld0JveD0iMCAwIDY0OS45OTk5OCA0MDUuNjMyMjYiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2Zzg5NSI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhODk5Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT5Bc3NldCAxPC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczg3OSI+CiAgICA8c3R5bGUKICAgICAgIHR5cGU9InRleHQvY3NzIgogICAgICAgaWQ9InN0eWxlODc3Ij4uYXtvcGFjaXR5OjA7fS5ie2ZpbGw6I2ZmZjt9LmN7ZmlsbDojZmY1ZjAwO30uZHtmaWxsOiNlYjAwMWI7fS5le2ZpbGw6I2Y3OWUxYjt9PC9zdHlsZT4KICA8L2RlZnM+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlODgxIj5Bc3NldCAxPC90aXRsZT4KICA8cmVjdAogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOiNmZjVmMDA7c3Ryb2tlLXdpZHRoOjUuNDkzODExNjEiCiAgICAgY2xhc3M9ImMiCiAgICAgeD0iMjI5LjgzMjYzIgogICAgIHk9IjQ3LjI5NzczNyIKICAgICB3aWR0aD0iMTkwLjQxNTUxIgogICAgIGhlaWdodD0iMzExLjAwNDciCiAgICAgaWQ9InJlY3Q4ODciIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZWIwMDFiO3N0cm9rZS13aWR0aDo1LjQ5MzgxMTYxIgogICAgIGNsYXNzPSJkIgogICAgIGQ9Im0gMjQ5LjQ0NTU0LDIwMi44Mjc1NiBhIDE5Ny40NDc1OSwxOTcuNDQ3NTkgMCAwIDEgNzUuNTM5OTEsLTE1NS40NzQ4NjcgMTk3Ljc3NzIyLDE5Ny43NzcyMiAwIDEgMCAwLDMxMS4wMDQ2NzcgMTk3LjQ0NzU5LDE5Ny40NDc1OSAwIDAgMSAtNzUuNTM5OTEsLTE1NS41Mjk4MSB6IgogICAgIGlkPSJwYXRoODg5IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y3OWUxYjtzdHJva2Utd2lkdGg6NS40OTM4MTE2MSIKICAgICBjbGFzcz0iZSIKICAgICBkPSJtIDYyNi4xMDEzLDMyNS4zOTQ1IHYgLTYuMzcyODIgaCAyLjc0NjkgdiAtMS4zMTg1MiBoIC02LjUzNzY0IHYgMS4zMTg1MiBoIDIuNTgyMSB2IDYuMzcyODIgeiBtIDEyLjY5MDcsMCB2IC03LjY5MTM0IGggLTEuOTc3NzggbCAtMi4zMDc0LDUuNDkzODEgLTIuMzA3NCwtNS40OTM4MSBoIC0xLjk3Nzc3IHYgNy42OTEzNCBoIDEuNDI4MzkgdiAtNS44MjM0NCBsIDIuMTQyNTksNC45OTkzNyBoIDEuNDgzMzMgbCAyLjE0MjU4LC00Ljk5OTM3IHYgNS44MjM0NCB6IgogICAgIGlkPSJwYXRoODkxIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2Y3OWUxYjtzdHJva2Utd2lkdGg6NS40OTM4MTE2MSIKICAgICBjbGFzcz0iZSIKICAgICBkPSJtIDY0NSwyMDIuODI3NTYgYSAxOTcuNzc3MjIsMTk3Ljc3NzIyIDAgMCAxIC0zMjAuMDE0NTUsMTU1LjQ3NDg3IDE5Ny43NzcyMiwxOTcuNzc3MjIgMCAwIDAgMCwtMzExLjAwNDY3NSBBIDE5Ny43NzcyMiwxOTcuNzc3MjIgMCAwIDEgNjQ1LDIwMi43NzI2MiBaIgogICAgIGlkPSJwYXRoODkzIiAvPgo8L3N2Zz4K"
                                    />
                                    <img
                                        style={{width: "40px"}}
                                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9InN2ZzEwOTA4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNzUwIDIwNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzUwIDIwNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMxMDI5OEU7fQoJLnN0MXtmaWxsOiNGRkJFMDA7fQo8L3N0eWxlPgo8dGl0bGU+c2VwYTwvdGl0bGU+CjxwYXRoIGlkPSJwYXRoNTY4OSIgY2xhc3M9InN0MCIgZD0iTTE2Ni42LDY1LjRoLTUxLjNjMC04LjQtMS0xNC4xLTMtMTdjLTMtNC4zLTExLjQtNi40LTI1LjItNi40Yy0xMy40LDAtMjIuMywxLjItMjYuNiwzLjcKCVM1NCw1My42LDU0LDYxLjhjMCw3LjUsMS45LDEyLjQsNS43LDE0LjdjMy40LDEuOCw3LjEsMi44LDEwLjksMi45TDgxLDgwLjJjMjIuMiwxLjUsMzYsMi41LDQxLjYsMy4xYzE3LjUsMS44LDMwLjMsNi40LDM4LjEsMTQKCWM2LjIsNS45LDkuOSwxMy42LDExLjEsMjMuMWMwLjcsNi40LDEuMSwxMi45LDEsMTkuM2MwLDE2LjUtMS42LDI4LjYtNC43LDM2LjJjLTUuNywxNC4xLTE4LjUsMjIuOS0zOC41LDI2LjYKCWMtOC4zLDEuNi0yMS4xLDIuNC0zOC4zLDIuNGMtMjguNywwLTQ4LjgtMS43LTYwLjEtNS4xYy0xMy45LTQuMi0yMy0xMi44LTI3LjUtMjUuNkMxLjIsMTY3LjEsMCwxNTUuMiwwLDEzOC41aDUxLjN2NC4zCgljMCw4LjksMi42LDE0LjYsNy43LDE3LjJjNCwxLjksOC40LDIuOCwxMi44LDIuOGgxOC45YzkuNiwwLDE1LjgtMC41LDE4LjQtMS41YzQuNy0xLjksNy44LTQuOSw5LjMtOWMwLjktMy4yLDEuMy02LjUsMS4yLTkuOQoJYzAtOS0zLjMtMTQuNS05LjktMTYuNWMtMi41LTAuOC0xMy45LTEuOS0zNC4zLTMuMmMtMTYuNC0xLjItMjcuOC0yLjMtMzQuMi0zLjRjLTE2LjgtMy4xLTI4LTkuNi0zMy42LTE5LjQKCUMyLjcsOTEuNSwwLjIsNzguOSwwLjIsNjJjMC0xMi44LDEuMy0yMy4xLDQtMzAuOXM2LjktMTMuNiwxMi44LTE3LjZjOC42LTYuMiwxOS43LTkuOCwzMy4yLTEwLjljMTEuMi0xLDIzLjctMS41LDM3LjMtMS41CgljMjEuNSwwLDM2LjksMS4yLDQ2LDMuN2MyMi4zLDYsMzMuNSwyMi44LDMzLjUsNTAuNEMxNjcuMSw1Ny41LDE2Ni45LDYwLjksMTY2LjYsNjUuNCIvPgo8cGF0aCBpZD0icGF0aDU2OTMiIGNsYXNzPSJzdDAiIGQ9Ik0zOTIuMywyMDVWMGgxMDIuOGMxNC4xLDAsMjQuOCwxLjEsMzIuMiwzLjVjMTYuOSw1LjMsMjguMiwxNi4xLDM0LDMyLjUKCWMzLDguNiw0LjUsMjEuNSw0LjUsMzguOGMwLDIwLjgtMS43LDM1LjctNSw0NC44Yy02LjYsMTgtMjAuMSwyOC4zLTQwLjYsMzFjLTIuNCwwLjQtMTIuNywwLjgtMzAuOCwxLjFsLTkuMiwwLjNoLTMyLjh2NTNIMzkyLjN6CgkgTTQ0Ny41LDEwNC41aDM0LjRjMTAuOS0wLjQsMTcuNS0xLjIsMTkuOS0yLjVjMy4yLTEuOCw1LjUtNS40LDYuNS0xMC44YzAuOC01LjMsMS4yLTEwLjYsMS0xNmMwLTguNy0wLjctMTUuMS0yLjEtMTkuMwoJYy0yLTUuOS02LjgtOS41LTE0LjItMTAuOGMtMS41LTAuMi01LjEtMC4zLTEwLjctMC4zaC0zNC44VjEwNC41eiIvPgo8cGF0aCBpZD0icGF0aDU2OTciIGNsYXNzPSJzdDAiIGQ9Ik02ODMuNiwxNjkuNWgtNzMuOGwtOS45LDM1LjVoLTU3LjFMNjA0LjUsMGg4My4yTDc1MCwyMDVoLTU1LjlMNjgzLjYsMTY5LjV6IE02NzIuNiwxMjkuNgoJbC0yNS44LTg4LjlsLTI1LjEsODguOUg2NzIuNnoiLz4KPHBhdGggaWQ9InBhdGg1NzAxIiBjbGFzcz0ic3QxIiBkPSJNMzE2LjIsMjguOGMyMS45LDAsNDIuNiw5LjksNTYuNCwyNi45bDExLjktMjUuNUMzNjUsMTEuOSwzMzkuMywxLjcsMzEyLjYsMS44CgljLTQzLjUsMC04MC42LDI2LjItOTUuOSw2My40aC0yMy4ybC0xMy43LDI5LjNoMjkuOGMtMC4yLDIuNy0wLjQsNS40LTAuNCw4LjJjMCwzLjMsMC4yLDYuNywwLjUsMTBoLTE1bC0xMy43LDI5LjRoMzYuMwoJYzE1LjcsMzYuMiw1Mi40LDYxLjcsOTUuMiw2MS43YzIwLjcsMCw0MC45LTYsNTguMS0xNy41di0zNmMtMjYuNCwzMC4yLTcyLjIsMzMuMi0xMDIuNCw2LjhjLTUtNC40LTkuNC05LjQtMTMtMTVoNzZsMTMuNy0yOS40CglIMjQ0LjJjLTAuNS0zLjYtMC44LTcuMi0wLjgtMTAuOGMwLTIuNSwwLjEtNC45LDAuNC03LjRoMTA5LjhsMTMuNy0yOS4zaC0xMTRDMjY2LjIsNDIuNywyOTAuMiwyOC45LDMxNi4yLDI4LjgiLz4KPHBhdGggaWQ9InBhdGg1NzA1IiBjbGFzcz0ic3QwIiBkPSJNMzE2LjIsMjkuN2MyMS42LDAsNDIuMSw5LjgsNTUuNywyNi42bDAuOSwxLjFsMC42LTEuM2wxMS45LTI1LjVsMC4zLTAuNmwtMC41LTAuNAoJYy0zNi0zMy43LTkwLjUtMzguMi0xMzEuNS0xMC43Yy0xNi44LDExLjMtMzAsMjcuMy0zNy43LDQ2bDAuOC0wLjZIMTkzbC0wLjIsMC41bC0xMy43LDI5LjRsLTAuNiwxLjNoMzEuMmwtMC45LTEKCWMtMC4yLDMtMC40LDUuOC0wLjQsOC4zYzAsMy40LDAuMiw2LjcsMC41LDEwLjFsMC45LTFoLTE1LjVsLTAuMiwwLjVsLTEzLjcsMjkuNGwtMC42LDEuMmgzNy43bC0wLjgtMC41YzE2LjQsMzcuOCw1NCw2Mi4yLDk2LDYyLjIKCWMyMC45LDAuMSw0MS4zLTYuMSw1OC42LTE3LjZsMC40LTAuM1YxNDhsLTEuNSwxLjhjLTI2LjEsMjkuOC03MS40LDMyLjgtMTAxLjIsNi43Yy00LjktNC4zLTkuMi05LjMtMTIuOC0xNC44bC0wLjcsMS40aDc2LjYKCWwwLjItMC41bDEzLjctMjkuNGwwLjYtMS4ySDI0NC4ybDAuOSwwLjhjLTAuNS0zLjUtMC44LTcuMS0wLjgtMTAuN2MwLTIuNCwwLjEtNC45LDAuNC03LjNsLTAuOSwwLjhoMTEwLjRsMC4yLTAuNUwzNjgsNjUuNgoJbDAuNi0xLjNIMjUzLjJsMC44LDEuM0MyNjYuOCw0My41LDI5MC41LDI5LjgsMzE2LjIsMjkuNyBNMjUzLjIsNjYuMWgxMTRsLTAuOC0xLjJsLTEzLjcsMjkuNGwwLjgtMC41SDI0Mi45bC0wLjEsMC44CgljLTAuMiwyLjUtMC40LDUtMC40LDcuNWMwLDMuNywwLjMsNy40LDAuOCwxMWwwLjEsMC44SDM0NWwtMC44LTEuM2wtMTMuNywyOS40bDAuOC0wLjVoLTc3LjdsMC45LDEuNGMyMi4yLDM0LDY3LjcsNDMuNiwxMDEuNywyMS40CgljNS42LTMuNywxMC43LTguMSwxNS4yLTEzLjJsLTEuNS0wLjZ2MzZsMC40LTAuN0MzNTMuMiwxOTcsMzMzLjEsMjAzLDMxMi42LDIwM2MtNDEuMiwwLTc4LjMtMjQtOTQuNC02MS4xbC0wLjItMC41aC0zNi45bDAuOCwxLjMKCWwxMy43LTI5LjRsLTAuOCwwLjVoMTZsLTAuMS0xYy0wLjMtMy4zLTAuNS02LjctMC41LTkuOWMwLTIuNSwwLjEtNS4yLDAuNC04LjJsMC4xLTFoLTMwLjhsMC44LDEuMmwxMy43LTI5LjNsLTAuOCwwLjVoMjMuOAoJbDAuMi0wLjVjNy42LTE4LjQsMjAuNS0zNC4xLDM3LjEtNDUuMmM0MC4zLTI3LDkzLjktMjIuNiwxMjkuMiwxMC41bC0wLjItMWwtMTEuOSwyNS41bDEuNS0wLjJjLTI1LjYtMzEuNS03MS44LTM2LjQtMTAzLjQtMTAuOAoJYy03LDUuNy0xMi45LDEyLjYtMTcuNCwyMC40bC0wLjgsMS4zTDI1My4yLDY2LjF6Ii8+Cjwvc3ZnPgo="
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {rudexService === "gateway" && rudexGatewayCoins.length ? (
                        <div>
                            <div>
                                <Translate
                                    href={
                                        this.props.currentLocale == "ru"
                                            ? agreement_ru
                                            : agreement_en
                                    }
                                    content="gateway.rudex.rudex_notice1"
                                    component="a"
                                    target="_blank"
                                />

                                <h5>
                                    <input
                                        type="checkbox"
                                        defaultChecked={
                                            this.state.RudexNotice1Informed
                                        }
                                        onChange={this.onRudexNotice1Informed.bind(
                                            this
                                        )}
                                    />{" "}
                                    -{" "}
                                    <Translate content="gateway.rudex.rudex_notice1_informed" />
                                </h5>
                            </div>

                            <hr />
                            {RudexNotice1Informed ? (
                                <RuDexGateway
                                    account={account}
                                    coins={rudexGatewayCoins}
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {rudexService === "fiat" ? (
                        <div>
                            <div>
                                <Translate
                                    href={
                                        "https://merchant.raidofinance.eu/media/83eef3d5a17bf300af9986e913c2c99d.pdf"
                                    }
                                    content="gateway.rudex.rudex_notice_third_party"
                                    component="a"
                                    target="_blank"
                                />

                                <h5>
                                    <input
                                        type="checkbox"
                                        defaultChecked={
                                            this.state
                                                .RudexNotice1Informed_BuyCrypto
                                        }
                                        onChange={this.onRudexNotice1Informed_BuyCrypto.bind(
                                            this
                                        )}
                                    />{" "}
                                    -{" "}
                                    <Translate content="gateway.rudex.rudex_notice1_informed_third_party_service" />
                                </h5>
                            </div>

                            <hr />
                            {RudexNotice1Informed_BuyCrypto ? (
                                <RaidoFinance account={account} />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            )
        });

        return serList;
    }

    render() {
        let {account, servicesDown} = this.props;
        let {activeService} = this.state;

        let rudexGatewayCoins = this.props.rudexBackedCoins
            .map(coin => {
                return coin;
            })
            .sort((a, b) => {
                if (a.symbol < b.symbol) return -1;
                if (a.symbol > b.symbol) return 1;
                return 0;
            });

        let services = this.renderServices(rudexGatewayCoins);

        const serviceNames = [];
        let options = services.map((services_obj, index) => {
            serviceNames.push(services_obj.identifier);
            return (
                <option key={index} value={index}>
                    {services_obj.name}
                </option>
            );
        });

        const currentServiceName = serviceNames[activeService];
        const currentServiceDown = servicesDown.get(currentServiceName);

        return (
            <div
                className={
                    this.props.contained ? "grid-content" : "grid-container"
                }
            >
                <div
                    className={this.props.contained ? "" : "grid-content"}
                    style={{paddingTop: "2rem"}}
                >
                    {/*<div className="grid-block vertical medium-horizontal no-margin no-padding">
                        <div style={{paddingBottom: "1rem"}}>
                            <DepositModal
                                ref="deposit_modal"
                                modalId="deposit_modal_new"
                                account={this.props.currentAccount}
                                backedCoins={this.props.backedCoins}
                            />
                            <WithdrawModal
                                ref="withdraw_modal"
                                modalId="withdraw_modal_new"
                                backedCoins={this.props.backedCoins}
                            />
                            <TranslateWithLinks
                                string="gateway.phase_out_warning"
                                keys={[
                                    {
                                        arg: "deposit_modal_link",
                                        value: (
                                            <a
                                                onClick={() => {
                                                    if (this.refs.deposit_modal)
                                                        this.refs.deposit_modal.show();
                                                }}
                                            >
                                                <Translate content="modal.deposit.submit" />
                                            </a>
                                        )
                                    },
                                    {
                                        arg: "withdraw_modal_link",
                                        value: (
                                            <a
                                                onClick={() => {
                                                    if (
                                                        this.refs.withdraw_modal
                                                    )
                                                        this.refs.withdraw_modal.show();
                                                }}
                                            >
                                                <Translate content="modal.withdraw.submit" />
                                            </a>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </div>*/}
                    <Translate content="gateway.title" component="h2" />
                    <div className="grid-block vertical medium-horizontal no-margin no-padding">
                        <div className="medium-6 show-for-medium">
                            <HelpContent
                                path="components/DepositWithdraw"
                                section="deposit-short"
                            />
                        </div>
                        <div className="medium-5 medium-offset-1">
                            <HelpContent
                                account={account.get("name")}
                                path="components/DepositWithdraw"
                                section="receive"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="grid-block vertical medium-horizontal no-margin no-padding">
                            <div className="medium-6 small-order-2 medium-order-1">
                                <Translate
                                    component="label"
                                    className="left-label"
                                    content="gateway.service"
                                />
                                <select
                                    onChange={this.onSetService.bind(this)}
                                    className="bts-select"
                                    value={activeService}
                                >
                                    {options}
                                </select>
                                {currentServiceDown ? (
                                    <Translate
                                        style={{
                                            color: "red",
                                            marginBottom: "1em",
                                            display: "block"
                                        }}
                                        content={`gateway.unavailable_${currentServiceName}`}
                                    />
                                ) : null}
                            </div>
                            <div
                                className="medium-5 medium-offset-1 small-order-1 medium-order-2"
                                style={{paddingBottom: 20}}
                            >
                                <Translate
                                    component="label"
                                    className="left-label"
                                    content="gateway.your_account"
                                />
                                <div className="inline-label">
                                    <AccountImage
                                        size={{height: 40, width: 40}}
                                        account={account.get("name")}
                                        custom_image={null}
                                    />
                                    <input
                                        type="text"
                                        value={account.get("name")}
                                        placeholder={null}
                                        disabled
                                        onChange={() => {}}
                                        onKeyDown={() => {}}
                                        tabIndex={1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="grid-content no-padding"
                        style={{paddingTop: 15}}
                    >
                        {currentServiceDown
                            ? null
                            : activeService && services[activeService]
                                ? services[activeService].template
                                : services[0].template}
                    </div>
                </div>
            </div>
        );
    }
}
AccountDepositWithdraw = BindToChainState(AccountDepositWithdraw);

class DepositStoreWrapper extends React.Component {
    componentWillMount() {
        updateGatewayBackers();
    }

    render() {
        return <AccountDepositWithdraw {...this.props} />;
    }
}

export default connect(
    DepositStoreWrapper,
    {
        listenTo() {
            return [AccountStore, SettingsStore, GatewayStore];
        },
        getProps() {
            return {
                currentAccount:
                    AccountStore.getState().currentAccount ||
                    AccountStore.getState().passwordAccount,
                account: AccountStore.getState().currentAccount,
                viewSettings: SettingsStore.getState().viewSettings,
                currentLocale: SettingsStore.getState().settings.get("locale"),
                backedCoins: GatewayStore.getState().backedCoins,
                openLedgerBackedCoins: GatewayStore.getState().backedCoins.get(
                    "OPEN",
                    []
                ),
                rudexBackedCoins: GatewayStore.getState().backedCoins.get(
                    "RUDEX",
                    []
                ),
                bitsparkBackedCoins: GatewayStore.getState().backedCoins.get(
                    "SPARKDEX",
                    []
                ),
                blockTradesBackedCoins: GatewayStore.getState().backedCoins.get(
                    "TRADE",
                    []
                ),
                citadelBackedCoins: GatewayStore.getState().backedCoins.get(
                    "CITADEL",
                    []
                ),
                xbtsxBackedCoins: GatewayStore.getState().backedCoins.get(
                    "XBTSX",
                    []
                ),
                servicesDown: GatewayStore.getState().down || {}
            };
        }
    }
);
