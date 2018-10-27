import React from "react";
import "react-select/dist/react-select.css";
import Apis from "lib/bots/apis";
import AssetImage from "../../Utility/AssetImage";
import AsyncSelect from "react-select/lib/Async";
import {debounce} from "lodash-es";
import GatewayStore from "stores/GatewayStore";

export const AssetLabel = ({name}) => (
    <div>
        <AssetImage replaceNoneToBts={false} maxWidth={30} name={name} />
        {name}
    </div>
);

var options = [
    "BTS",
    "BTC",
    "USD",
    "EUR",
    "RUBLE",
    ...GatewayStore.getState()
        .backedCoins.get("RUDEX", [])
        .map(coin => coin.symbol)
].map(name => ({value: name, label: <AssetLabel name={name} />}));

class AssetSelector extends React.Component {
    componentDidMount() {
        this.promiseOptions = debounce(this.promiseOptions, 200);
    }

    onChange = option => {
        console.log("onChange", option);
        this.props.onChange({
            target: {
                name: this.props.name,
                value: option ? option.value : ""
            }
        });
    };

    promiseOptions = async inputValue => {
        inputValue = inputValue.toUpperCase();

        let result = options.filter(i => i.value == inputValue);

        if (result.length === 0 && inputValue) {
            let asset = (await Apis.db.list_assets(inputValue, 1))[0];

            if (asset && !options.find(i => i.value == asset.symbol)) {
                options.push({
                    value: asset.symbol,
                    label: <AssetLabel name={asset.symbol} />
                });
            }
        }

        return {options};
    };

    render() {
        let value = options.find(option => option.value === this.props.value);

        return (
            <div style={{marginBottom: 30}}>
                <AsyncSelect
                    value={value}
                    onChange={this.onChange}
                    loadOptions={this.promiseOptions}
                    searchPromptText="Please wait..."
                    placeholder="Your asset"
                />
            </div>
        );
    }
}

export default AssetSelector;
