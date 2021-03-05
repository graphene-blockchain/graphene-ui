import Apis from "lib/bots/apis";

class Asset {
    static get(_, name) {
        if (this[name]) return this[name];

        return /^1\.3\.\d+$/.test(name) || !isNaN(name)
            ? this.id(name)
            : this.getAsset(name);
    }

    static async getAsset(_symbol) {
        let symbol = _symbol.toUpperCase();

        this.map = this.map || {};

        if (this.map[symbol]) return this.map[symbol];

        let obj = (await Apis.db.list_assets(symbol, 1))[0];

        if (!obj || obj.symbol !== symbol)
            throw new Error(
                `Not found asset ${symbol}! Blockchain return ${
                    obj ? obj.symbol : obj
                }`
            );

        this.map[symbol] = new this(obj);
        return this.map[symbol];
    }

    static async id(id) {
        this.map = this.map || {};
        let asset = Object.keys(this.map).find(
            symbol => this.map[symbol].id == id
        );

        if (asset) return this.map[asset];

        asset = (await Apis.db.get_assets([id]))[0];

        if (!asset) throw new Error(`Not found asset by id ${id}!`);

        this.map[asset.symbol] = new this(asset);
        return this.map[asset.symbol];
    }

    static async fromParam(param) {
        return {amount: param.amount, asset: await this.id(param.asset_id)};
    }

    static async update() {
        this.map = this.map || {};

        let assets = await Apis.db.get_assets(
            Object.keys(this.map).map(symbol => this.map[symbol].id)
        );
        assets.forEach(asset => Object.assign(this.map[asset.symbol], asset));
    }

    constructor(rpcObj) {
        Object.assign(this, rpcObj);
    }

    toParam(number = 0) {
        return {amount: number, asset_id: this.id};
    }

    fee() {
        return this.options.market_fee_percent / 100 / 100;
    }

    async update() {
        Object.assign(this, (await Apis.db.get_assets([this.id]))[0]);
    }
}

export default new Proxy({}, Asset);
