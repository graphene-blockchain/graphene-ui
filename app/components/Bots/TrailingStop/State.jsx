import React from "react";
import {AssetLabel} from "../libs/AssetSelector";
import Select from "react-select";

class State extends React.Component {
    state = {
        validate: []
    };

    componentWillMount() {
        let state = this.props.bot.storage.read();
        state.stoploss = state.minAmount / state.amount;

        this.setState(state);
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

        this.setState({[name]: value});
    };

    validate = (name, value) => {};

    handleUpdateBot = () => {
        this.props.bot.storage.write(this.state);
    };

    render() {
        return (
            <div>
                <div
                    className="grid-block horizontal"
                    style={{marginLeft: 50, marginTop: 50}}
                >
                    <div className="content-block">
                        <label className="left-label">Sell asset</label>
                        <Select
                            style={{marginBottom: 30}}
                            name="sellAsset"
                            value={{
                                value: this.state.sellAsset,
                                label: (
                                    <AssetLabel name={this.state.sellAsset} />
                                )
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">Amount</label>
                        <input
                            name="amount"
                            id="amount"
                            type="text"
                            ref="input"
                            value={this.state.amount}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes("amount")
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                    </div>
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label className="left-label">Get asset</label>
                        <Select
                            style={{marginBottom: 30}}
                            name="getAsset"
                            value={{
                                value: this.state.getAsset,
                                label: <AssetLabel name={this.state.getAsset} />
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">Min Amount</label>
                        <input
                            name="minAmount"
                            id="minAmount"
                            type="text"
                            ref="input"
                            value={this.state.minAmount}
                            onChange={this.handleChange}
                            disabled={this.props.bot.run}
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
                    <label className="left-label">Stoploss</label>
                    <input
                        name="stoploss"
                        id="stoploss"
                        type="text"
                        ref="input"
                        value={this.state.stoploss}
                        onChange={this.handleChange}
                        disabled={this.props.bot.run}
                        style={{
                            marginBottom: 30,
                            border: this.state.validate.includes("stoploss")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                    <label className="left-label">Trailing Percent, %</label>
                    <input
                        name="percent"
                        id="percent"
                        type="text"
                        ref="input"
                        value={this.state.percent}
                        onChange={this.handleChange}
                        disabled={this.props.bot.run}
                        style={{
                            marginBottom: 30,
                            border: this.state.validate.includes("percent")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>
                <button
                    className="button"
                    onClick={this.handleUpdateBot}
                    disabled={this.props.bot.run}
                    style={{marginLeft: 50, marginBottom: 30}}
                >
                    Update
                </button>
            </div>
        );
    }
}

export default State;
