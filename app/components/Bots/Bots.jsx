import React from "react";
import BotManager from "lib/bots";
import AccountStore from "stores/AccountStore";

const strategies = Object.keys(BotManager.strategies);
const accounts = Array.from(AccountStore.getState().myActiveAccounts);

class Bots extends React.Component {
    state = {
        selectStrategy: strategies[0],
        bots: BotManager.getBots(accounts[0]),
        selectBot: null
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

    render() {
        console.log("selectStrategy", this.state.selectStrategy);
        //let CreateForm = BotManager.strategies[this.state.selectStrategy].create

        let CreateForm = () => {
            let Create =
                BotManager.strategies[this.state.selectStrategy].create;

            return (
                <div className="content-block">
                    <Create
                        ref={form => {
                            this.createForm = form;
                        }}
                        account={accounts[0]}
                        name={this.state.selectStrategy}
                    />
                    <button
                        className="button float-right no-margin"
                        type="submit"
                        disabled={false}
                    >
                        Create
                    </button>
                </div>
            );
        };

        let StateForm = () => {
            if (this.state.selectBot) {
                let State = this.state.bots[this.state.selectBot].state;
                return (
                    <div>
                        <State bot={this.state.bots[this.state.selectBot]} />
                        <button
                            className="button"
                            onClick={() =>
                                this.state.bots[this.state.selectBot].start()
                            }
                        >
                            Start
                        </button>
                        <button
                            className="button"
                            onClick={() =>
                                this.state.bots[this.state.selectBot].stop()
                            }
                        >
                            Stop
                        </button>
                        <button className="button">Delete</button>
                    </div>
                );
            } else {
                return <p>Please, select bot</p>;
            }
        };
        //console.log("state form",StateForm)
        //console.log("bots", this.state.bots)

        return (
            <div className="grid-block vertical">
                <div className="grid-block shrink vertical medium-horizontal">
                    <form
                        style={{paddingBottom: 20, overflow: "visible"}}
                        className="grid-content small-12 medium-6 large-5 large-offset-1 full-width-content"
                        onSubmit={this.handleCreate}
                        noValidate
                    >
                        <div className="content-block">
                            <div className="left-label" style={{marginTop: 30}}>
                                Select strategy:
                            </div>
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
                        <CreateForm />
                    </form>
                    <div className="content-block">
                        {"Bot state:"}
                        <select
                            className={
                                "form-control account-select bts-select "
                            }
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
                            <StateForm />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bots;
