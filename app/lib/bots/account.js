import Apis from "lib/bots/apis";
import Assets from "lib/bots/assets";
import BigNumber from "bignumber.js";
import WalletDb from "stores/WalletDb";
import WalletUnlockActions from "actions/WalletUnlockActions";
import {TransactionBuilder} from "bitsharesjs";

class Account {
    constructor(name, feeSymbol = "BTS") {
        this.promise = Promise.all([
            Apis.db.get_account_by_name(name),
            Assets[feeSymbol]
        ]).then(([acc, fee]) => {
            this.acc = acc;
            this.feeAsset = fee;
        });
    }

    async cancelOrder(id) {
        await this.promise;

        return this.sendTransaction("limit_order_cancel", {
            fee: this.feeAsset.toParam(),
            fee_paying_account: this.acc.id,
            order: id,
            extensions: []
        });
    }

    async buy(
        buySymbol,
        baseSymbol,
        amount,
        price,
        fill_or_kill = false,
        expire = "2020-02-02T02:02:02"
    ) {
        await this.promise;

        let buyAsset = await Assets[buySymbol],
            baseAsset = await Assets[baseSymbol],
            buyAmount = Math.floor(amount * 10 ** buyAsset.precision),
            sellAmount = Math.floor(
                BigNumber(amount)
                    .times(price * 10 ** baseAsset.precision)
                    .toString()
            );

        if (buyAmount == 0 || sellAmount == 0)
            throw new Error("Amount equal 0!");

        let tx = await this.sendTransaction("limit_order_create", {
            fee: this.feeAsset.toParam(),
            seller: this.acc.id,
            amount_to_sell: baseAsset.toParam(sellAmount),
            min_to_receive: buyAsset.toParam(buyAmount),
            expiration: expire,
            fill_or_kill: fill_or_kill,
            extensions: []
        });

        return (await Apis.db.get_objects([
            tx[0].trx.operation_results[0][1]
        ]))[0];
    }

    async sell(
        sellSymbol,
        baseSymbol,
        amount,
        price,
        fill_or_kill = false,
        expire = "2020-02-02T02:02:02"
    ) {
        await this.promise;

        let sellAsset = await Assets[sellSymbol],
            baseAsset = await Assets[baseSymbol],
            sellAmount = Math.floor(amount * 10 ** sellAsset.precision),
            buyAmount = Math.floor(
                BigNumber(amount)
                    .times(price * 10 ** baseAsset.precision)
                    .toString()
            );

        if (buyAmount == 0 || sellAmount == 0)
            throw new Error("Amount equal 0!");

        let tx = await this.sendTransaction("limit_order_create", {
            fee: this.feeAsset.toParam(),
            seller: this.acc.id,
            amount_to_sell: sellAsset.toParam(sellAmount),
            min_to_receive: baseAsset.toParam(buyAmount),
            expiration: expire,
            fill_or_kill: fill_or_kill,
            extensions: []
        });

        return (await Apis.db.get_objects([
            tx[0].trx.operation_results[0][1]
        ]))[0];
    }

    async balances() {
        await this.promise;
        return Apis.db.get_account_balances(this.acc.id, [...arguments]);
    }

    async sendTransaction(type, operation) {
        let tr = new TransactionBuilder();
        tr.add_type_operation(type, operation);
        await tr.set_required_fees();

        await WalletUnlockActions.unlock();
        let private_key = WalletDb.getPrivateKey(
            this.acc.active.key_auths[0][0]
        );
        tr.add_signer(
            private_key,
            private_key.toPublicKey().toPublicKeyString()
        );

        return tr.broadcast();
    }
}

export default Account;
