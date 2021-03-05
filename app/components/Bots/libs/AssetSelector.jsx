import React from "react";
import "react-select/dist/react-select.css";
import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import AssetImage from "../../Utility/AssetImage";
import AsyncSelect from "react-select/lib/Async";
import {debounce} from "lodash-es";
import {getMyMarketsQuotes, getAssetHideNamespaces} from "branding";
import counterpart from "counterpart";

export class AssetLabel extends React.Component {
    state = {
        name: null
    };

    hidePrefix = name => {
        let arr = name.split(".");
        if (getAssetHideNamespaces().includes(`${arr[0]}.`)) arr.shift();

        return arr.join(".");
    };

    componentWillMount() {
        this.setAssetName(this.props.name);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name)
            this.setAssetName(nextProps.name);
    }

    setAssetName = async name => {
        let asset = await Assets[name];

        this.setState({
            name: asset.bitasset_data_id ? `bit${name}` : name
        });
    };

    render() {
        return (
            <div>
                <AssetImage
                    replaceNoneToBts={false}
                    maxWidth={30}
                    name={this.props.name}
                />
                {this.hidePrefix(this.state.name || this.props.name)}
            </div>
        );
    }
}

var options = getMyMarketsQuotes().map(name => ({
    value: name,
    label: <AssetLabel name={name} />
}));

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
                    searchPromptText={counterpart.translate(
                        "bots.asset_selector.wait"
                    )}
                    placeholder={counterpart.translate(
                        "bots.asset_selector.placeholder"
                    )}
                />
            </div>
        );
    }
}

export default AssetSelector;
