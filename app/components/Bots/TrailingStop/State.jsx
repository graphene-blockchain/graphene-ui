import React from "react";

class State extends React.Component {
    state = {
        validate: []
    };

    componentWillMount() {
        this.setState(this.props.bot.storage.read());
    }

    handleChange = event => {
        let name = event.target.name,
            value = event.target.value;

        if (["sellAsset", "getAsset"].includes(name))
            value = value.toUpperCase();

        this.setState({[name]: value});
    };

    render() {
        return (
            <div>
                <div className="grid-block horizontal" style={{marginLeft: 50}}>
                    <div className="content-block">
                        <label className="left-label">Sell asset</label>
                        <input
                            name="sellAsset"
                            id="sellAsset"
                            type="text"
                            ref="input"
                            value={this.state.sellAsset}
                            onChange={this.handleChange}
                            style={{
                                marginBottom: 30
                            }}
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
                        <input
                            name="getAsset"
                            id="getAsset"
                            type="text"
                            ref="input"
                            value={this.state.getAsset}
                            onChange={this.handleChange}
                            style={{
                                marginBottom: 30
                            }}
                            disabled
                        />
                    </div>
                </div>
                <div className="content-block">
                    <label className="left-label">Percent, %</label>
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

export default State;
