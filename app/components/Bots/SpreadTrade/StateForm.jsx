import React from "react";

class StateForm extends React.Component {
    render() {
        console.log("StateForm props", this.props);
        return (
            <div>
                <p>Hello State SpreadTrade! {this.props.bot.name}!!</p>
                <div>
                    <div className="content-block">
                        <label className="left-label">Name</label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            ref="input"
                            onChange={this.handleChange}
                            autoComplete="name"
                        />
                    </div>
                    <div className="content-block">
                        <label className="left-label">Base</label>
                        <div className="content-block">
                            <label className="left-label">Asset</label>
                            <input
                                name="baseAsset"
                                id="baseAsset"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="baseAsset"
                            />
                        </div>
                        <div className="content-block">
                            <label className="left-label">Balance</label>
                            <input
                                name="baseBalance"
                                id="baseBalance"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="baseBalance"
                            />
                        </div>
                        <div className="content-block">
                            <label className="left-label">Amount</label>
                            <input
                                name="baseAmount"
                                id="baseAmount"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="baseAmount"
                            />
                        </div>
                        <div className="content-block">
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
                    </div>
                    <div className="content-block">
                        <label className="left-label">Quote</label>
                        <div className="content-block">
                            <label className="left-label">Asset</label>
                            <input
                                name="quoteAsset"
                                id="quoteAsset"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="quoteAsset"
                            />
                        </div>
                        <div className="content-block">
                            <label className="left-label">Balance</label>
                            <input
                                name="quoteBalance"
                                id="quoteBalance"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="quoteBalance"
                            />
                        </div>
                        <div className="content-block">
                            <label className="left-label">Amount</label>
                            <input
                                name="quoteAmount"
                                id="quoteAmount"
                                type="text"
                                ref="input"
                                onChange={this.handleChange}
                                autoComplete="quoteAmount"
                            />
                        </div>
                        <div className="content-block">
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
            </div>
        );
    }
}

export default StateForm;
