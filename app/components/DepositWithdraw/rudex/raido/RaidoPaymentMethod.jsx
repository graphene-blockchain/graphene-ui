import React from "react";

class RaidoPaymentMethod extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let {title, payment_id} = this.props;
        let classNname = "";

        if (
            this.props.active.toLowerCase() ==
            this.props.payment_id.toLowerCase()
        )
            classNname = "active";
        else classNname = "";

        return (
            <div className="ant-col-8">
                <label className={"btn btn-sm btn-radio" + " " + classNname}>
                    <input
                        name={"paymentmethod-" + payment_id}
                        type="radio"
                        onClick={this.props.onClick()}
                    />
                    {title}
                    <img
                        src={
                            `${__BASE_URL__}images/raido-payment-` +
                            payment_id +
                            ".png"
                        }
                    />
                </label>
            </div>
        );
    }
}

export default RaidoPaymentMethod;
