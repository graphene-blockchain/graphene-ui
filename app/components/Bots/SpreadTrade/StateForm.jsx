import React from "react";

class StateForm extends React.Component {
    state = {
        validate: []
    };

    componentWillMount() {
        console.log(this.props.bot);

        this.setState(this.props.bot.storage.read());
    }

    render() {
        console.log("StateForm props", this.props);
        return (
            <div>
                <div className="grid-block horizontal">
                    <div className="content-block" style={{marginLeft: 50}}>
                        <label style={{textAlign: "center"}}>Base</label>
                        <label className="left-label">Asset</label>
                        <input
                            name="baseAsset"
                            id="baseAsset"
                            type="text"
                            ref="input"
                            value={this.state.base.asset}
                            disabled
                            style={{
                                marginBottom: 30
                            }}
                        />
                        <label className="left-label">Balance</label>
                        <input
                            name="baseBalance"
                            id="baseBalance"
                            type="text"
                            ref="input"
                            value={this.state.base.balance}
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
                            value={this.state.base.amount}
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
                            value={this.state.base.spread}
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
                            value={this.state.quote.asset}
                            disabled
                            style={{
                                marginBottom: 30
                            }}
                        />
                        <label className="left-label">Balance</label>
                        <input
                            name="quoteBalance"
                            id="quoteBalance"
                            type="text"
                            ref="input"
                            value={this.state.quote.balance}
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
                            value={this.state.quote.amount}
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
                            value={this.state.quote.spread}
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
                </div>
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

export default StateForm;
