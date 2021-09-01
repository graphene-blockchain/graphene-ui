import React from "react";
import AssetWrapper from "../Bots/libs/AssetWrapper";
import PropTypes from "prop-types";

class AssetImage extends React.Component {
    static propTypes = {
        replaceNoneToBts: PropTypes.bool,
        maxWidth: PropTypes.number
    };

    static defaultProps = {
        replaceNoneToBts: true,
        maxWidth: 20
    };

    constructor(props) {
        super(props);

        this.state = {
            imgError: false
        };
    }

    shouldComponentUpdate(np, ns) {
        return (
            this.props.asset !== np.asset ||
            this.props.maxWidth !== np.maxWidth ||
            this.props.whiteList !== np.whiteList ||
            this.state.imgError !== ns.imgError
        );
    }

    _onError(imgName) {
        if (!this.state.imgError) {
            if (this.props.replaceNoneToBts)
                this.refs[imgName.toLowerCase()].src =
                    "asset-symbols/unknown.png";
            else this.refs[imgName.toLowerCase()].remove();
            this.setState({
                imgError: true
            });
        }
    }

    render() {
        let {asset} = this.props;

        function getImageName(asset) {
            if (asset === null) return null;
            let symbol = asset.get("symbol");

            if (symbol.startsWith("RUDEX.") || symbol.startsWith("DONATE"))
                return "rudex";

            return symbol;
        }

        const imgName = getImageName(asset);

        return (
            <img
                ref={imgName.toLowerCase()}
                className="column-hide-small"
                onError={this._onError.bind(this, imgName)}
                style={{
                    maxWidth: this.props.maxWidth,
                    marginRight: 5,
                    marginTop: "-3px"
                }}
                src={`${__BASE_URL__}asset-symbols/${imgName.toLowerCase()}.png`}
            />
        );
    }
}

AssetImage = AssetWrapper(AssetImage);

export default class AssetImageWrapper extends React.Component {
    render() {
        return <AssetImage {...this.props} asset={this.props.name} />;
    }
}
