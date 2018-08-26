import React from "react";
import BotManager from "lib/bots";
import AccountStore from "stores/AccountStore";
import {connect} from "alt-react";

class Bots extends React.Component {
    constructor() {
        super();

        this.strategies = BotManager.strategies;
        this.state = {
            selectStrategy: Object.keys(this.strategies)[0],
            bots: [],
            selectBot: 0,
            enableCreate: false,
            botRun: false
        };
    }

    componentDidMount() {
        let bots = BotManager.getBots(this.props.currentAccount);
        this.setState({
            bots,
            selectBot: 0,
            botRun: bots[0].run
        });
    }

    handleChangeStrategy = event => {
        this.setState({selectStrategy: event.target.value});
    };

    handleChangeBot = event => {
        let selectBot = event.target.value;

        this.setState({
            selectBot,
            botRun: this.state.bots[selectBot].run
        });
    };

    handleCreate = event => {
        event.preventDefault();
        let bots = this.state.bots;

        bots.push(
            BotManager.create(
                this.state.selectStrategy,
                this.props.currentAccount,
                this.createForm.state
            )
        );
        this.setState({bots});

        if (this.createForm.validate)
            this.createForm.validate("name", this.createForm.state.name);
    };

    handleEnableCreate = enableCreate => {
        if (this.state.enableCreate != enableCreate)
            this.setState({enableCreate});
    };

    handleStartBot = async () => {
        let bot = this.state.bots[this.state.selectBot];

        await bot.start();
        this.setState({botRun: bot.run});
    };

    handleStopBot = async () => {
        let bot = this.state.bots[this.state.selectBot];

        await bot.stop();
        this.setState({botRun: bot.run});
    };

    handleDeleteBot = () => {
        BotManager.delete(this.state.bots[this.state.selectBot]);

        this.setState({
            bots: BotManager.getBots(this.props.currentAccount),
            selectBot: 0
        });
    };

    render() {
        //console.log("start render main page", this.props)
        if (this.props.currentAccount === null) return null;

        let CreateForm = this.strategies[this.state.selectStrategy].create;

        let bot = this.state.bots[this.state.selectBot] || null;

        return (
            <div className="grid-block vertical">
                <div className="grid-block shrink vertical medium-horizontal">
                    <form
                        style={{paddingBottom: 20, overflow: "visible"}}
                        className="grid-content small-12 medium-6 large-5 large-offset-1 full-width-content"
                        onSubmit={this.handleCreate}
                        noValidate
                    >
                        <div className="left-label" style={{marginTop: 30}}>
                            Select strategy:
                        </div>
                        <div className="content-block">
                            <div className="content-block">
                                <select
                                    className={"form-control bts-select "}
                                    value={this.state.selectStrategy}
                                    onChange={this.handleChangeStrategy}
                                >
                                    {Object.keys(this.strategies).map(name => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr />
                        <div className="content-block">
                            <CreateForm
                                ref={form => {
                                    this.createForm = form;
                                }}
                                account={this.props.currentAccount}
                                name={this.state.selectStrategy}
                                enableCreate={this.handleEnableCreate}
                            />
                            <button
                                className="button no-margin"
                                type="submit"
                                disabled={!this.state.enableCreate}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                    <div className="content-block">
                        <div className="left-label" style={{marginTop: 30}}>
                            Bot state:
                        </div>
                        <select
                            className={"form-control bts-select"}
                            value={this.state.selectBot}
                            onChange={this.handleChangeBot}
                        >
                            {this.state.bots.map((bot, index) => (
                                <option key={bot.name} value={index}>
                                    {`${bot.name} (${bot.constructor.name})`}
                                </option>
                            ))}
                        </select>
                        <div className="content-block">
                            {bot ? (
                                <div>
                                    <bot.state key={bot.name} bot={bot} />
                                    <button
                                        className="button"
                                        onClick={this.handleStartBot}
                                        disabled={this.state.botRun}
                                        style={{marginLeft: 50}}
                                    >
                                        Start
                                    </button>
                                    <button
                                        className="button"
                                        onClick={this.handleStopBot}
                                        disabled={!this.state.botRun}
                                        style={{marginLeft: 50}}
                                    >
                                        Stop
                                    </button>
                                    <button
                                        className="button"
                                        onClick={this.handleDeleteBot}
                                        disabled={this.state.botRun}
                                        style={{marginLeft: 50}}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <p>Please, select bot</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    Bots,
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
);
