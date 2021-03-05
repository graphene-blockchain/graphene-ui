import React from "react";
import {AssetLabel} from "../libs/AssetSelector";
import Select from "react-select";
import Translate from "react-translate-component";

class State extends React.Component {
    componentWillMount() {
        this.setState(
            Object.assign({validate: []}, this.props.bot.storage.read())
        );
    }

    handleChange = event => {
        let name = event.target.name,
            value = event.target.value,
            base,
            quote;

        //console.log(name, value, typeof value);

        switch (name) {
            case "baseAmount":
                base = this.state.base;
                base.amount = value;
                this.setState({base});
                break;
            case "percentBaseAmount":
                base = this.state.base;
                base.percent = value == "true";
                this.setState({base});
                break;
            case "baseBalance":
                base = this.state.base;
                base.balance = value;
                this.setState({base});
                break;
            case "baseSpread":
                base = this.state.base;
                base.spread = value;
                this.setState({base});
                break;
            case "quoteAmount":
                quote = this.state.quote;
                quote.amount = value;
                this.setState({quote});
                break;
            case "percentQuoteAmount":
                quote = this.state.quote;
                quote.percent = value == "true";
                this.setState({quote});
                break;
            case "quoteBalance":
                quote = this.state.quote;
                quote.balance = value;
                this.setState({quote});
                break;
            case "quoteSpread":
                quote = this.state.quote;
                quote.spread = value;
                this.setState({quote});
                break;
            case "defaultPrice":
                this.setState({defaultPrice: value});
                break;
            case "fromMarket":
                this.setState({fromMarket: event.target.checked});
                break;
        }

        //this.setState({[name]: value}, () => this.validate(name, value));
    };

    handleUpdateBot = () => {
        let stateNow = this.props.bot.storage.read();
        this.state.base.order = stateNow.base.order;
        this.state.quote.order = stateNow.quote.order;

        this.props.bot.storage.write(this.state);
    };

    render() {
        return (
            <div>
                <div className="grid-block horizontal">
                    <div
                        className="content-block"
                        style={{
                            marginLeft: 50,
                            marginTop: 30
                        }}
                    >
                        <label style={{textAlign: "center"}}>
                            <Translate content="bots.common.base" />
                        </label>
                        {/*                        <label className="left-label">
                            <Translate content="bots.common.asset" />
                        </label>*/}
                        <Select
                            style={{marginBottom: 30}}
                            name="baseAsset"
                            value={{
                                value: this.state.base.asset,
                                label: (
                                    <AssetLabel name={this.state.base.asset} />
                                )
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">
                            <Translate content="bots.common.balance" />
                        </label>
                        <input
                            name="baseBalance"
                            type="text"
                            ref="input"
                            value={this.state.base.balance}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                        <div>
                            <input
                                type="radio"
                                value={true}
                                name="percentBaseAmount"
                                checked={this.state.base.percent}
                                onChange={this.handleChange}
                            />{" "}
                            <Translate content="bots.spread_trade.balance_percent" />
                            <br />
                            <input
                                type="radio"
                                value={false}
                                name="percentBaseAmount"
                                checked={!this.state.base.percent}
                                onChange={this.handleChange}
                            />{" "}
                            <Translate content="bots.spread_trade.balance_value" />
                        </div>
                        <input
                            name="baseAmount"
                            type="text"
                            ref="input"
                            value={this.state.base.amount}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                            type="text"
                            ref="input"
                            value={this.state.base.spread}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                    <div
                        className="content-block"
                        style={{
                            marginLeft: 50,
                            marginTop: 30
                        }}
                    >
                        <label style={{textAlign: "center"}}>
                            <Translate content="bots.common.quote" />
                        </label>
                        {/*                        <label className="left-label">
                            <Translate content="bots.common.asset" />
                        </label>*/}
                        <Select
                            style={{marginBottom: 30}}
                            name="quoteAsset"
                            value={{
                                value: this.state.quote.asset,
                                label: (
                                    <AssetLabel name={this.state.quote.asset} />
                                )
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">
                            <Translate content="bots.common.balance" />
                        </label>
                        <input
                            name="quoteBalance"
                            type="text"
                            ref="input"
                            value={this.state.quote.balance}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                        <div>
                            <input
                                type="radio"
                                value={true}
                                name="percentQuoteAmount"
                                checked={this.state.quote.percent}
                                onChange={this.handleChange}
                            />{" "}
                            <Translate content="bots.spread_trade.balance_percent" />
                            <br />
                            <input
                                type="radio"
                                value={false}
                                name="percentQuoteAmount"
                                checked={!this.state.quote.percent}
                                onChange={this.handleChange}
                            />{" "}
                            <Translate content="bots.spread_trade.balance_value" />
                        </div>
                        <input
                            name="quoteAmount"
                            type="text"
                            ref="input"
                            value={this.state.quote.amount}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                            type="text"
                            ref="input"
                            value={this.state.quote.spread}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                        type="text"
                        ref="input"
                        value={this.state.defaultPrice}
                        onChange={this.handleChange}
                        disabled={this.props.bot.run}
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
                            disabled={this.props.bot.run}
                        />
                        <Translate content="bots.spread_trade.get_price_from_market" />
                    </label>
                </div>
                <button
                    className="button"
                    onClick={this.handleUpdateBot}
                    disabled={this.props.bot.run}
                    style={{marginLeft: 50, marginBottom: 30}}
                >
                    <Translate content="bots.common.update" />
                </button>
            </div>
        );
    }
}

export default State;
