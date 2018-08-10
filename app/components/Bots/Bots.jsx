import React from "react";
import BotManager from "lib/bots";
import AccountStore from "stores/AccountStore";

const strategies = Object.keys(BotManager.strategies);
const accounts = Array.from(AccountStore.getState().myActiveAccounts);

class Bots extends React.Component {
    state = {
        selectStrategy: strategies[0],
        bots: BotManager.getBots(accounts[0]),
        selectBot: null,
        enableCreate: true
    };

    handleChangeStrategy = event => {
        this.setState({selectStrategy: event.target.value});
    };

    handleChangeBot = event => {
        this.setState({selectBot: event.target.value});
    };

    handleCreate = event => {
        event.preventDefault();
        let bots = this.state.bots;

        bots.push(
            BotManager.create(
                this.state.selectStrategy,
                accounts[0],
                this.createForm.state
            )
        );
        this.setState({bots});
    };

    handleEnableCreate = enableCreate => {
        if (this.state.enableCreate != enableCreate)
            this.setState({enableCreate});
    };

    render() {
        let CreateForm =
            BotManager.strategies[this.state.selectStrategy].create;

        let bot = this.state.selectBot
            ? this.state.bots[this.state.selectBot]
            : null;

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
                                    value={this.props.selectStrategy}
                                    onChange={this.handleChangeStrategy}
                                >
                                    {strategies.map(name => (
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
                                account={accounts[0]}
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
                            value={this.props.selectBot}
                            onChange={this.handleChangeBot}
                        >
                            <option key="empty" value={null}>
                                Select bot
                            </option>
                            {this.state.bots.map((bot, index) => (
                                <option key={bot.name} value={index}>
                                    {bot.name}
                                </option>
                            ))}
                        </select>
                        <div className="content-block">
                            {this.state.selectBot ? (
                                <div>
                                    <bot.state bot={bot} />
                                    <button
                                        className="button"
                                        onClick={() => bot.start()}
                                        disabled={bot.run}
                                    >
                                        Start
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => bot.stop()}
                                        disabled={!bot.run}
                                    >
                                        Stop
                                    </button>
                                    <button
                                        className="button"
                                        disabled={bot.run}
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

export default Bots;
