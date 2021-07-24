import React from "react";
import Translate from "react-translate-component";
import FormattedAsset from "../../Utility/FormattedAsset";
import TranslateWithLinks from "../../Utility/TranslateWithLinks";

export const WorkerCreate = ({op, fromComponent}) => {
    if (fromComponent === "proposed_operation") {
        return (
            <span>
                <TranslateWithLinks
                    string="proposal.worker_create"
                    keys={[
                        {
                            type: "account",
                            value: op[1].owner,
                            arg: "account"
                        },
                        {
                            type: "amount",
                            value: {
                                amount: op[1].daily_pay,
                                asset_id: "1.3.0"
                            },
                            arg: "pay"
                        }
                    ]}
                    params={{
                        name: op[1].name
                    }}
                />
            </span>
        );
    } else {
        return (
            <span>
                <TranslateWithLinks
                    string="operation.worker_create"
                    keys={[
                        {
                            type: "account",
                            value: op[1].owner,
                            arg: "account"
                        },
                        {
                            type: "amount",
                            value: {
                                amount: op[1].daily_pay,
                                asset_id: "1.3.0"
                            },
                            arg: "pay"
                        }
                    ]}
                    params={{
                        name: op[1].name
                    }}
                />
            </span>
        );
    }
};
