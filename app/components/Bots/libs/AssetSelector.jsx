import React from "react";
import "react-select/dist/react-select.css";
import Apis from "lib/bots/apis";
//import AssetImage from "../../Utility/AssetImage";
import AsyncSelect from "react-select/lib/Async";

var options = [
    {value: "BTS", label: "BTS"},
    {value: "RUDEX.BTC", label: "BTC"},
    {value: "RUDEX.ETH", label: "ETH"},
    {value: "RUDEX.EOS", label: "EOS"},
    {value: "BTC", label: "bitBTC"}
];

class AssetSelector extends React.Component {
    state = {options};

    onChange = option => {
        //console.log("onChange", option)
        this.props.onChange({
            target: {
                name: this.props.name,
                value: option.value
            }
        });
    };

    promiseOptions = async (inputValue, callback) => {
        console.log("promise", inputValue);
        let result = options.filter(i => i.label == inputValue.toUpperCase());
        console.log(result);
        if (result.length === 0 && inputValue) {
            let asset = (await Apis.db.list_assets(
                inputValue.toUpperCase(),
                1
            ))[0];

            console.log("asset", asset);
            if (asset) {
                callback(null, {
                    options: [
                        {
                            value: asset.symbol,
                            label: asset.symbol
                        }
                    ]
                });
                return;
            }
        }

        callback(null, {options});
    };

    render() {
        let value = options.find(option => option.value === this.props.value);

        if (!value) value = {value: this.props.value, label: this.props.value};

        return (
            <div style={{marginBottom: 12}}>
                <AsyncSelect
                    value={value}
                    onChange={this.onChange}
                    cacheOptions
                    defaultOptions
                    loadOptions={this.promiseOptions}
                    //onInputChange={this.onChange}
                />
            </div>
        );
    }
}

export default AssetSelector;
