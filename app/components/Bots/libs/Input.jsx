import React from "react";

class Input extends React.Component {
    render() {
        let {name, value, onChange, border, ...props} = this.props;
        return (
            <input
                name={name}
                id={name}
                type="text"
                ref="input"
                value={value}
                onChange={onChange}
                style={{
                    marginBottom: 30,
                    border: border ? "1px solid red" : "none"
                }}
                {...props}
            />
        );
    }
}

export default Input;
