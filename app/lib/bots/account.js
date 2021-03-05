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
        expire = "2025-02-02T02:02:02"
    ) {
        await this.promise;

        let buyAsset = await Assets[
                typeof buySymbol === "object" ? buySymbol.asset_id : buySymbol
            ],
            baseAsset = await Assets[
                typeof baseSymbol === "object"
                    ? baseSymbol.asset_id
                    : baseSymbol
            ],
            buyAmount = Math.floor(
                BigNumber(
                    typeof buySymbol === "object" ? buySymbol.amount : amount
                )
                    .times(10 ** buyAsset.precision)
                    .toString()
            ),
            sellAmount = Math.floor(
                (typeof baseSymbol === "object"
                    ? BigNumber(baseSymbol.amount)
                    : BigNumber(amount).times(price)
                )
                    .times(10 ** baseAsset.precision)
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
        expire = "2025-02-02T02:02:02"
    ) {
        await this.promise;

        let sellAsset = await Assets[
                typeof sellSymbol === "object"
                    ? sellSymbol.asset_id
                    : sellSymbol
            ],
            baseAsset = await Assets[
                typeof baseSymbol === "object"
                    ? baseSymbol.asset_id
                    : baseSymbol
            ],
            sellAmount = Math.floor(
                BigNumber(
                    typeof sellSymbol === "object" ? sellSymbol.amount : amount
                )
                    .times(10 ** sellAsset.precision)
                    .toString()
            ),
            buyAmount = Math.floor(
                (typeof baseSymbol === "object"
                    ? BigNumber(baseSymbol.amount)
                    : BigNumber(amount).times(price)
                )
                    .times(10 ** baseAsset.precision)
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
