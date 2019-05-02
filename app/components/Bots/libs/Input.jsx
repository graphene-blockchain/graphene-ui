import React from "react";

const render = ({name, value, onChange, border, ...props}) => (
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

export default render;
