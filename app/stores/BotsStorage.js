import ls from "common/localStorage";

var bots = ls("__bots__");

class Storage {
    static getAccountBot(account) {
        let re = new RegExp(`^__bots__${account}::`);
        return Object.keys(localStorage).filter(key => re.test(key));
    }

    static has(name) {
        return bots.has(name);
    }

    constructor(name) {
        //bots.has(name)
        this.name = name;
        //if (!bots.has(name))
        //bots.set(name, {})
    }

    init(data) {
        if (!bots.has(name)) bots.set(this.name, data);
    }

    read() {
        return bots.get(this.name);
    }

    write(newState) {
        bots.set(this.name, newState);
    }

    delete() {
        bots.remove(this.name);
    }
}

export default Storage;
