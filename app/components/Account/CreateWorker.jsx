import React from "react";
import {connect} from "alt-react";
import ApplicationApi from "api/ApplicationApi";
import AccountStore from "stores/AccountStore";
import utils from "common/utils";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import {Notification} from "bitshares-ui-style-guide";

class CreateWorker extends React.Component {
    constructor() {
        super();

        this.state = {
            title: null,
            start: new Date(),
            start_time: "00:00",
            end: null,
            end_time: "00:00",
            pay: null,
            url: "http://",
            vesting: 7
        };
    }

    shouldComponentUpdate(np, ns) {
        return (
            np.currentAccount !== this.props.currentAccount,
            !utils.are_equal_shallow(ns, this.state)
        );
    }

    onSubmit() {
        ApplicationApi.createWorker(
            this.state,
            this.props.currentAccount
        ).catch(error => {
            console.log("error", error);
            let error_msg =
                error.message &&
                error.message.length &&
                error.message.length > 0
                    ? error.message.split("stack")[0]
                    : "unknown error";

            Notification.error({
                message: counterpart.translate(
                    "notifications.worker_create_failure",
                    {
                        error_msg: error_msg
                    }
                )
            });
        });
    }

    render() {
        console.log("state:", this.state);
        return (
            <div className="grid-block" style={{paddingTop: 20}}>
                <div className="grid-content large-9 large-offset-3 small-12">
                    <Translate
                        content="explorer.workers.create"
                        component="h3"
                    />
                    <form style={{maxWidth: 800}}>
                        <Translate
                            content="explorer.workers.create_text_1"
                            component="p"
                        />
                        <Translate
                            content="explorer.workers.create_text_2"
                            component="p"
                        />

                        <label>
                            <Translate content="explorer.workers.title" />
                            <input
                                onChange={e => {
                                    this.setState({title: e.target.value});
                                }}
                                type="text"
                            />
                        </label>
                        <Translate
                            content="explorer.workers.name_text"
                            component="p"
                        />
                        <div
                            style={{
                                width: "50%",
                                paddingRight: "2.5%",
                                display: "inline-block"
                            }}
                        >
                            <label>
                                <Translate content="account.votes.start" />
                                <input
                                    onChange={e => {
                                        let time = new Date(e.target.value);
                                        time.setHours(
                                            this.state.start_time.split(":")[0],
                                            this.state.start_time.split(":")[1],
                                            0,
                                            0
                                        );
                                        this.setState({
                                            start: new Date(time)
                                        });
                                    }}
                                    type="date"
                                />
                            </label>
                        </div>
                        <div
                            style={{
                                width: "50%",
                                paddingRight: "2.5%",
                                display: "inline-block"
                            }}
                        >
                            <label>
                                <Translate content="explorer.workers.time_start" />
                                <input
                                    defaultValue={this.state.start_time}
                                    onChange={e => {
                                        let time = new Date();
                                        time.setTime(
                                            this.state.start.getTime()
                                        );
                                        time.setHours(
                                            e.target.value.split(":")[0],
                                            e.target.value.split(":")[1],
                                            0,
                                            0
                                        );
                                        this.setState({
                                            start: time,
                                            start_time: e.target.value
                                        });
                                    }}
                                    type="time"
                                />
                            </label>
                        </div>
                        <div
                            style={{
                                width: "50%",
                                paddingRight: "2.5%",
                                display: "inline-block"
                            }}
                        >
                            <label>
                                <Translate content="account.votes.end" />
                                <input
                                    onChange={e => {
                                        let time = new Date(e.target.value);
                                        time.setHours(
                                            this.state.end_time.split(":")[0],
                                            this.state.end_time.split(":")[1],
                                            0,
                                            0
                                        );
                                        this.setState({
                                            end: new Date(time)
                                        });
                                    }}
                                    type="date"
                                />
                            </label>
                        </div>

                        <div
                            style={{
                                width: "50%",
                                paddingRight: "2.5%",
                                display: "inline-block"
                            }}
                        >
                            <label>
                                <Translate content="explorer.workers.time_finish" />
                                <input
                                    defaultValue={this.state.end_time}
                                    onChange={e => {
                                        let time = new Date();
                                        try {
                                            time.setTime(
                                                this.state.end.getTime()
                                            );
                                        } catch (e) {
                                            time.setTime(new Date().getTime());
                                        }
                                        time.setHours(
                                            e.target.value.split(":")[0],
                                            e.target.value.split(":")[1],
                                            0,
                                            0
                                        );
                                        this.setState({
                                            end: time,
                                            end_time: e.target.value
                                        });
                                    }}
                                    type="time"
                                />
                            </label>
                        </div>

                        <Translate
                            content="explorer.workers.date_text"
                            component="p"
                        />

                        <label>
                            <Translate content="explorer.workers.daily_pay" />
                            <input
                                onChange={e => {
                                    this.setState({pay: e.target.value});
                                }}
                                type="number"
                            />
                        </label>
                        <Translate
                            content="explorer.workers.pay_text"
                            component="p"
                        />

                        <label>
                            <Translate content="explorer.workers.website" />
                            <input
                                onChange={e => {
                                    this.setState({url: e.target.value});
                                }}
                                type="text"
                            />
                        </label>
                        <Translate
                            content="explorer.workers.url_text"
                            component="p"
                        />

                        <label>
                            <Translate content="explorer.workers.vesting_pay" />
                            <input
                                defaultValue={this.state.vesting}
                                onChange={e => {
                                    this.setState({
                                        vesting: parseInt(e.target.value)
                                    });
                                }}
                                type="number"
                            />
                        </label>
                        <Translate
                            content="explorer.workers.vesting_text"
                            component="p"
                        />

                        <div
                            className="button-group"
                            onClick={this.onSubmit.bind(this)}
                        >
                            <div className="button" type="submit">
                                Publish
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default (CreateWorker = connect(
    CreateWorker,
    {
        listenTo() {
            return [AccountStore];
        },
        getProps() {
            return {
                currentAccount: AccountStore.getState().currentAccount
            };
        }
    }
));
