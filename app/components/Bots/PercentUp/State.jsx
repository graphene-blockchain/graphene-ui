import React from "react";
import {AssetLabel} from "../libs/AssetSelector";
import Select from "react-select";
import Input from "../libs/Input";
import Translate from "react-translate-component";

class State extends React.Component {
    componentWillMount() {
        this.setState(
            Object.assign({validate: []}, this.props.bot.storage.read())
        );
    }

    handleChange = event => {
        let name = event.target.name,
            value = event.target.value;

        if (["base", "quote"].includes(name)) value = value.toUpperCase();

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
            case "base":
            case "quote":
                if (value.length !== 0) {
                    this.assetValidate(name);
                } else {
                    validate.push(name);
                    this.setState({validate});
                }
                break;
            case "balance":
                if (value !== "-" && isNaN(+value)) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;
            case "spread":
            case "distance":
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

        //this.props.enableCreate(validate.length == 0);
    };

    handleUpdateBot = () => {
        let stateNow = this.props.bot.storage.read();

        this.props.bot.storage.write({...stateNow, ...this.state});
    };

    render() {
        let {validate, amount, balance, spread, distance} = this.state;

        return (
            <div>
                <div className="grid-block horizontal" style={{marginLeft: 50}}>
                    <div className="content-block">
                        <label className="left-label">
                            <Translate content="bots.common.base" />
                        </label>
                        <Select
                            style={{marginBottom: 30}}
                            name="base"
                            value={{
                                value: this.state.base,
                                label: <AssetLabel name={this.state.base} />
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">
                            <Translate content="bots.common.amount" />
                        </label>
                        <div onChange={this.handleChange}>
                            <input
                                type="radio"
                                value={true}
                                name="percentAmount"
                            />{" "}
                            <Translate content="bots.common.balance_percent" />
                            <br />
                            <input
                                type="radio"
                                value={false}
                                name="percentAmount"
                                defaultChecked
                            />{" "}
                            <Translate content="bots.common.balance_value" />
                        </div>
                        <Input
                            name="amount"
                            value={amount}
                            onChange={this.handleChange}
                            border={validate.includes("amount")}
                        />
                        <label className="left-label">
                            <Translate content="bots.common.balance" />
                        </label>
                        <Input
                            name="balance"
                            value={balance}
                            onChange={this.handleChange}
                            border={validate.includes("balance")}
                        />
                    </div>
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label className="left-label">
                            <Translate content="bots.common.quote" />
                        </label>
                        <Select
                            style={{marginBottom: 30}}
                            name="quote"
                            value={{
                                value: this.state.quote,
                                label: <AssetLabel name={this.state.quote} />
                            }}
                            clearable={false}
                            searchable={false}
                            disabled
                        />
                        <label className="left-label">
                            <Translate content="bots.common.spread" />
                        </label>
                        <Input
                            name="spread"
                            value={spread}
                            onChange={this.handleChange}
                            border={validate.includes("spread")}
                        />
                        <label className="left-label">
                            <Translate content="bots.percent_up.distance" />
                        </label>
                        <Input
                            name="distance"
                            value={distance}
                            onChange={this.handleChange}
                            border={validate.includes("distance")}
                        />
                    </div>
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
