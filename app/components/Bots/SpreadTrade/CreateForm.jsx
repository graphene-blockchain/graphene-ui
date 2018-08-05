import React from "react";
import BotManager from "lib/bots";
import {ChainStore} from "bitsharesjs";
//import {debounce} from "lodash-es";

/*
{
    name: "RubleWorker",
    strategy: "SpreadTrade",
    base: {
      asset: "bts",
      balance: 2,
      amount: 1,
      spread: 2,
    },
    quote: {
      asset: "ruble",
      balance: 1,
      amount: 1,
      spread: 2
    },
    movePercent: 2,
    defaultPrice: 10
}
*/
class CreateForm extends React.Component {
    state = {
        name: "",
        baseAsset: "USD",
        quoteAsset: "OPEN.BTC",
        validate: []
    };

    componentWillMount() {
        Object.keys(this.state).forEach(name =>
            this.validate(name, this.state[name])
        );
    }

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
                if (value.length == 0) {
                    validate.push(name);
                    this.setState({validate});
                } else {
                    this.setState({
                        validate: validate.filter(input => input !== name)
                    });
                }
                break;
        }
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
                            onChange={this.handleChange}
                            autoComplete="baseBalance"
                        />
                        <label className="left-label">Amount</label>
                        <input
                            name="baseAmount"
                            id="baseAmount"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="baseAmount"
                        />
                        <label className="left-label">Spread</label>
                        <input
                            name="baseSpread"
                            id="baseSpread"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="baseSpread"
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
                            onChange={this.handleChange}
                            autoComplete="quoteAsset"
                        />
                        <label className="left-label">Balance</label>
                        <input
                            name="quoteBalance"
                            id="quoteBalance"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="quoteBalance"
                        />
                        <label className="left-label">Amount</label>
                        <input
                            name="quoteAmount"
                            id="quoteAmount"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="quoteAmount"
                        />
                        <label className="left-label">Spread</label>
                        <input
                            name="quoteSpread"
                            id="quoteSpread"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="quoteSpread"
                        />
                    </div>
                </div>

                <div className="content-block">
                    <label className="left-label">Move Percent</label>
                    <input
                        name="movePercent"
                        id="movePercent"
                        type="text"
                        ref="input"
                        onChange={this.handleChange}
                        autoComplete="movePercent"
                    />
                </div>
                <div className="content-block">
                    <label className="left-label">Default Price</label>
                    <input
                        name="defaultPrice"
                        id="defaultPrice"
                        type="text"
                        ref="input"
                        onChange={this.handleChange}
                        autoComplete="defaultPrice"
                    />
                </div>
            </div>
        );
    }
}

export default CreateForm;
