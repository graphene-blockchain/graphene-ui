import React from "react";
import BotManager from "lib/bots";
import Apis from "lib/bots/apis";
import {debounce} from "lodash-es";
import AssetSelector from "../libs/AssetSelector";
import Translate from "react-translate-component";

class Create extends React.Component {
    state = {
        name: "",
        sellAsset: "RUDEX.BTC",
        getAsset: "RUDEX.USDT",
        amount: 0.01,
        minAmount: 1,
        stoploss: 100,
        percent: 10,
        validate: ["name"]
    };

    componentDidMount() {
        this.assetValidate = debounce(this.assetValidate, 200);
    }

    handleChange = event => {
        let name = event.target.name,
            value = event.target.value;

        if (["sellAsset", "getAsset"].includes(name))
            value = value.toUpperCase();

        if (name === "minAmount") {
            this.setState(
                {
                    minAmount: value,
                    stoploss: value / this.state.amount
                },
                () => this.validate(name, value)
            );
        } else if (name === "stoploss") {
            this.setState(
                {
                    minAmount: this.state.amount * value,
                    stoploss: value
                },
                () => this.validate(name, value)
            );
        } else if (name === "amount") {
            this.setState(
                {
                    amount: value,
                    minAmount: value * this.state.stoploss
                },
                () => this.validate(name, value)
            );
        } else {
            this.setState({[name]: value}, () => this.validate(name, value));
        }
    };

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
            case "sellAsset":
            case "getAsset":
                if (value.length !== 0) {
                    this.assetValidate(name);
                } else {
                    validate.push(name);
                    this.setState({validate});
                }
                break;
            case "amount":
            case "minAmount":
            case "pecent":
            case "stoploss":
                if (value === "" || isNaN(+value)) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
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
                        style={{
                            border: this.state.validate.includes("name")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>
                <div className="grid-block horizontal" style={{marginLeft: 50}}>
                    <div className="content-block">
                        <label className="left-label">
                            <Translate content="bots.trailing_stop.sell_asset" />
                        </label>
                        <AssetSelector
                            name="sellAsset"
                            value={this.state.sellAsset}
                            onChange={this.handleChange}
                        />
                        <label className="left-label">
                            <Translate content="bots.trailing_stop.amount" />
                        </label>
                        <input
                            name="amount"
                            id="amount"
                            type="text"
                            ref="input"
                            value={this.state.amount}
                            onChange={this.handleChange}
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes("amount")
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                    </div>
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label className="left-label">
                            <Translate content="bots.trailing_stop.get_asset" />
                        </label>
                        <AssetSelector
                            name="getAsset"
                            value={this.state.getAsset}
                            onChange={this.handleChange}
                        />
                        <label className="left-label">
                            <Translate content="bots.trailing_stop.min_amount" />
                        </label>
                        <input
                            name="minAmount"
                            id="minAmount"
                            type="text"
                            ref="input"
                            value={this.state.minAmount}
                            onChange={this.handleChange}
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "minAmount"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                    </div>
                </div>
                <div className="content-block">
                    <label className="left-label">
                        <Translate content="bots.trailing_stop.stoploss" />
                    </label>
                    <input
                        name="stoploss"
                        id="stoploss"
                        type="text"
                        ref="input"
                        value={this.state.stoploss}
                        onChange={this.handleChange}
                        style={{
                            marginBottom: 30,
                            border: this.state.validate.includes("stoploss")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                    <label className="left-label">
                        <Translate content="bots.trailing_stop.trailing_percent" />
                    </label>
                    <input
                        name="percent"
                        id="percent"
                        type="text"
                        ref="input"
                        value={this.state.percent}
                        onChange={this.handleChange}
                        style={{
                            marginBottom: 30,
                            border: this.state.validate.includes("percent")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Create;
