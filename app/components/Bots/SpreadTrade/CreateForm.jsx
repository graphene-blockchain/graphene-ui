import React from "react";
import BotManager from "lib/bots";
import {ChainStore} from "bitsharesjs";
//import {debounce} from "lodash-es";

class CreateForm extends React.Component {
    state = {
        name: "",
        baseAsset: "USD",
        quoteAsset: "OPEN.BTC",
        baseAmount: 10,
        quoteAmount: 0.01,
        baseSpread: 10,
        quoteSpread: 10,
        //movePercent: 5,
        baseBalance: 100,
        quoteBalance: 0.1,
        validate: ["name"]
    };

    handleChange = event => {
        console.log(event.target.name, event.target.value);
        let name = event.target.name,
            value = event.target.value;

        this.setState({[name]: value}, () => this.validate(name, value));
    };

    validate = (name, value) => {
        let validate = this.state.validate;

        switch (name) {
            case "name":
                if (
                    value.length == 0 ||
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
                    // TODO check asset in blockchain
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                } else {
                    validate.push(name);
                    this.setState({validate});
                }
                break;
            case "baseAmount":
            case "quoteAmount":
            case "baseBalance":
            case "quoteBalance":
            case "baseSpread":
            case "quoteSpread":
            /*case "movePercent":
                if (value === "" || isNaN(+value)) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;*/
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

        //console.log(this.state.validate)
        this.props.enableCreate(this.state.validate.length == 0);
    };

    render() {
        return (
            <div>
                <div className="content-block">
                    <label className="left-label">Name</label>
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
                        <label style={{textAlign: "center"}}>Base</label>
                        <label className="left-label">Asset</label>
                        <input
                            name="baseAsset"
                            id="baseAsset"
                            type="text"
                            ref="input"
                            value={this.state.baseAsset}
                            onChange={this.handleChange}
                            autoComplete="baseAsset"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "baseAsset"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">Balance</label>
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
                        <label className="left-label">Amount</label>
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
                        <label className="left-label">Spread</label>
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
                        <label style={{textAlign: "center"}}>Quote</label>
                        <label className="left-label">Asset</label>
                        <input
                            name="quoteAsset"
                            id="quoteAsset"
                            type="text"
                            ref="input"
                            value={this.state.quoteAsset}
                            onChange={this.handleChange}
                            autoComplete="quoteAsset"
                            style={{
                                marginBottom: 30,
                                border: this.state.validate.includes(
                                    "quoteAsset"
                                )
                                    ? "1px solid red"
                                    : "none"
                            }}
                        />
                        <label className="left-label">Balance</label>
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
                        <label className="left-label">Amount</label>
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
                        <label className="left-label">Spread</label>
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

                {/*<div className="content-block">
                    <label className="left-label">Move Percent</label>
                    <input
                        name="movePercent"
                        id="movePercent"
                        type="text"
                        ref="input"
                        value={this.state.movePercent}
                        onChange={this.handleChange}
                        autoComplete="movePercent"
                        style={{
                            border: this.state.validate.includes("movePercent")
                                ? "1px solid red"
                                : "none"
                        }}
                    />
                </div>*/}
                <div className="content-block">
                    <label className="left-label">Default Price</label>
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
            </div>
        );
    }
}

export default CreateForm;
