import React from "react";
import BotManager from "lib/bots";
import AssetSelector from "../libs/AssetSelector";
import Apis from "lib/bots/apis";
import {debounce} from "lodash-es";
import Input from "../libs/Input";
import Translate from "react-translate-component";

class Create extends React.Component {
    state = {
        name: "",
        base: "GPH",
        quote: "RUDEX.USDT",
        amount: 100,
        percentAmount: false,
        balance: "",
        spread: 1,
        distance: "1.5",
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

        console.log(validate);
        this.props.enableCreate(validate.length == 0);
    };

    render() {
        let {validate, name, amount, balance, spread, distance} = this.state;

        return (
            <div>
                <div className="content-block">
                    <label className="left-label">
                        <Translate content="bots.common.name" />
                    </label>
                    <Input
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        border={validate.includes("name")}
                    />
                </div>
                <div className="grid-block horizontal" style={{marginLeft: 50}}>
                    <div className="content-block">
                        <label className="left-label">
                            <Translate content="bots.common.base" />
                        </label>
                        <AssetSelector
                            name="base"
                            value={this.state.base}
                            onChange={this.handleChange}
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
                        <AssetSelector
                            name="quote"
                            value={this.state.quote}
                            onChange={this.handleChange}
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
            </div>
        );
    }
}

export default Create;
