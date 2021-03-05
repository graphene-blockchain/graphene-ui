import React from "react";
import Translate from "react-translate-component";
import IntlActions from "actions/IntlActions";

const FlagImage = ({flag, width = 20, height = 20}) => {
    return (
        <img
            height={height}
            width={width}
            src={`${__BASE_URL__}language-dropdown/${flag.toUpperCase()}.png`}
        />
    );
};

export default class LanguageDropdown extends React.Component {
    constructor() {
        super();

        this.state = {
            LanguageDropdownActive: false
        };
    }

    render() {
        const {LanguageDropdownActive, maxHeight, locales} = this.props;

        return !this.state.LanguageDropdownActive ? (
            <ul
                className="dropdown header-menu"
                style={{
                    right: "0px",
                    top: 64,
                    maxHeight: !LanguageDropdownActive ? 0 : maxHeight,
                    overflowY: "hidden",
                    fontSize: "15px",
                    borderRadius: "4px",
                    position: "absolute",
                    padding: "0px 20px 0px 0px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)"
                }}
            >
                {locales.map(locale => {
                    return (
                        <li
                            key={locale}
                            onClick={e => {
                                e.preventDefault();
                                IntlActions.switchLocale(locale);
                            }}
                            style={{
                                lineHeight: "2.2em",
                                padding: "4px 30px 0px 30px",
                                cursor: "pointer",
                                listStyleType: "none"
                            }}
                        >
                            <div
                                className="table-cell"
                                style={{
                                    paddingTop: "0px"
                                }}
                            >
                                <FlagImage flag={locale} />
                            </div>
                            <div
                                className="table-cell"
                                style={{paddingLeft: 10}}
                            >
                                <Translate content={"languages." + locale} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        ) : (
            false
        );
    }
}
