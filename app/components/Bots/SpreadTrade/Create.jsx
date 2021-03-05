import React from "react";
import BotManager from "lib/bots";
import Apis from "lib/bots/apis";
import {debounce} from "lodash-es";
import AssetSelector from "../libs/AssetSelector";
import Translate from "react-translate-component";

class Create extends React.Component {
    state = {
        name: "",
        baseAsset: "RUDEX.USDT",
        quoteAsset: "RUDEX.BTC",
        baseAmount: 10,
        quoteAmount: 0.01,
        baseSpread: 10,
        quoteSpread: 10,
        baseBalance: 100,
        quoteBalance: 0.1,
        percentBaseAmount: false,
        percentQuoteAmount: false,
        validate: ["name"]
    };

    componentDidMount() {
        this.assetValidate = debounce(this.assetValidate, 200);
    }

    assetValidate = async name => {
        let asset = this.state[name];
        let blockchainAssets = (await Apis.db.list_assets(asset, 1))[0];
        let validate = this.state.validate;

        if (asset !== blockchainAssets.symbol) validate.push(name);
        else {
            validate = validate.filter(input => input !== name);
        }

        this.setState({validate});
        this.props.enableCreate(this.state.validate.length == 0);
    };

    handleChange = event => {
        let name = event.target.name,
            value =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;
        console.log(name, value);

        if (["baseAsset", "quoteAsset"].includes(name))
            value = value.toUpperCase();

        this.setState({[name]: value}, () => this.validate(name, value));
    };

    validate = (name, value) => {
        let validate = this.state.validate;

        switch (name) {
            case "name":
                if (
                    !/^\w+$/.test(value) ||
                    BotManager.hasBot(
                        this.props.account,
                        this.props.name,
                        value
                    )
                ) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;
            case "baseAsset":
            case "quoteAsset":
                if (value.length !== 0) {
                    this.assetValidate(name);
                } else {
                    validate.push(name);
                    this.setState({validate});
                }
                break;
            case "baseBalance":
            case "quoteBalance":
                if (value !== "-" && isNaN(+value)) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;
            case "baseAmount":
            case "quoteAmount":
            case "baseSpread":
            case "quoteSpread":
                if (value === "" || isNaN(+value)) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;
            case "defaultPrice":
                if (!isNaN(+value))
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                else {
                    validate.push(name);
                    this.setState({validate});
                }
                break;
        }

        console.log(this.state.validate);
        this.props.enableCreate(this.state.validate.length == 0);
    };

    render() {
        return (
            <div>
                <div className="content-block">
                    <label className="left-label">
                        <Translate content="bots.common.name" />
                    </label>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        ref="input"
                        value={this.state.name}
                        onChange={this.handleChange}
                        autoComplete="name"
                        style={{
                            border: this.state.validate.includes("name")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>
                <div className="grid-block horizontal">
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label style={{textAlign: "center"}}>
                            <Translate content="bots.common.base" />
                        </label>
                        {/*                        <label className="left-label">
                            <Translate content="bots.common.asset" />
                        </label>*/}
                        <AssetSelector
                            name="baseAsset"
                            value={this.state.baseAsset}
                            onChange={this.handleChange}
                        />
                        <label className="left-label">
                            <Translate content="bots.common.balance" />
                        </label>
                        <input
                            name="baseBalance"
                            id="baseBalance"
                            type="text"
                            ref="input"
                            value={this.state.baseBalance}
                            onChange={this.handleChange}
                            autoComplete="baseBalance"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "baseBalance"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">
                            <Translate content="bots.common.amount" />
                        </label>
                        <div onChange={this.handleChange}>
                            <input
                                type="radio"
                                value={true}
                                name="percentBaseAmount"
                            />{" "}
                            <Translate content="bots.spread_trade.balance_percent" />
                            <br />
                            <input
                                type="radio"
                                value={false}
                                name="percentBaseAmount"
                                defaultChecked
                            />{" "}
                            <Translate content="bots.spread_trade.balance_value" />
                        </div>
                        <input
                            name="baseAmount"
                            id="baseAmount"
                            type="text"
                            ref="input"
                            value={this.state.baseAmount}
                            onChange={this.handleChange}
                            autoComplete="baseAmount"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "baseAmount"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">
                            <Translate content="bots.spread_trade.spread" />
                        </label>
                        <input
                            name="baseSpread"
                            id="baseSpread"
                            type="text"
                            ref="input"
                            value={this.state.baseSpread}
                            onChange={this.handleChange}
                            autoComplete="baseSpread"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "baseSpread"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                    </div>
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label style={{textAlign: "center"}}>
                            <Translate content="bots.common.quote" />
                        </label>
                        {/*                        <label className="left-label">
                            <Translate content="bots.common.asset" />
                        </label>*/}
                        <AssetSelector
                            name="quoteAsset"
                            value={this.state.quoteAsset}
                            onChange={this.handleChange}
                        />
                        <label className="left-label">
                            <Translate content="bots.common.balance" />
                        </label>
                        <input
                            name="quoteBalance"
                            id="quoteBalance"
                            type="text"
                            ref="input"
                            value={this.state.quoteBalance}
                            onChange={this.handleChange}
                            autoComplete="quoteBalance"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "quoteBalance"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">
                            <Translate content="bots.common.amount" />
                        </label>
                        <div onChange={this.handleChange}>
                            <input
                                type="radio"
                                value={true}
                                name="percentQuoteAmount"
                            />{" "}
                            <Translate content="bots.spread_trade.balance_percent" />
                            <br />
                            <input
                                type="radio"
                                value={false}
                                name="percentQuoteAmount"
                                defaultChecked
                            />{" "}
                            <Translate content="bots.spread_trade.balance_value" />
                        </div>
                        <input
                            name="quoteAmount"
                            id="quoteAmount"
                            type="text"
                            ref="input"
                            value={this.state.quoteAmount}
                            onChange={this.handleChange}
                            autoComplete="quoteAmount"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "quoteAmount"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">
                            <Translate content="bots.spread_trade.spread" />
                        </label>
                        <input
                            name="quoteSpread"
                            id="quoteSpread"
                            type="text"
                            ref="input"
                            value={this.state.quoteSpread}
                            onChange={this.handleChange}
                            autoComplete="quoteSpread"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "quoteSpread"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                    </div>
                </div>
                <div className="content-block">
                    <label className="left-label">
                        <Translate content="bots.spread_trade.default_price" />
                    </label>

                    <input
                        name="defaultPrice"
                        id="defaultPrice"
                        type="text"
                        ref="input"
                        value={this.state.defaultPrice}
                        onChange={this.handleChange}
                        autoComplete="defaultPrice"
                        style={{
                            border: this.state.validate.includes("defaultPrice")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>
                <div className="content-block">
                    <label>
                        <input
                            type="checkbox"
                            name="fromMarket"
                            onChange={this.handleChange}
                            checked={this.state.fromMarket}
                        />
                        <Translate content="bots.spread_trade.get_price_from_market" />
                    </label>
                </div>
            </div>
        );
    }
}

export default Create;
