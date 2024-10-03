import { api_base, api_base2 } from '@api-base';
import { observer } from '@utilities/observer';
import { roundBalance } from '../helpers';
import { doUntilDone } from '../tools';
import { contractStatus, contractSettled, contract as broadcastContract } from '../broadcast';
import { sell, openContractReceived } from './state/actions';
import { handleLostValue, handleWinValue } from '../../blocks/tools/vh_functions';

const AFTER_FINISH_TIMEOUT = 5;

export default Engine =>
    class OpenContract extends Engine {
        observeOpenContract() {
            api_base.api.onMessage().subscribe(({ data }) => {
                if (data?.error?.code) {
                    return;
                }
                if (data?.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;
                    if (!this.expectedContractId(contract.contract_id)) return;

                    this.setContractFlags(contract);

                    this.data.contract = contract;

                    broadcastContract({ accountID: this.accountInfo.loginid, ...contract });

                    if (this.isSold) {
                        contractStatus({
                            id: 'contract.sold',
                            data: contract.transaction_ids.sell,
                            contract,
                        });

                        contractSettled(contract);

                        this.contractId = '';
                        this.updateTotals(contract);

                        if (this.afterPromise) {
                            this.afterPromise();
                        }

                        this.store.dispatch(sell());
                        this.cancelSubscriptionTimeout();
                    } else {
                        this.store.dispatch(openContractReceived());
                        if (!this.isExpired) {
                            this.resetSubscriptionTimeout();
                        }
                    }
                }
            });
        }
        // Custom Obsorver Open Contract for VH
        observeOpenContractVH() {
            api_base2.api.onMessage().subscribe(({ data }) => {
                if (data?.error?.code) {
                    return;
                }
                if (data?.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;
                    if (!this.expectedContractId(contract.contract_id)) return;

                    this.setContractFlags(contract);

                    this.data.vh_contract = contract;

                    broadcastContract({ accountID: this.accountInfo.loginid, ...contract });

                    if (this.isSold) {
                        contractStatus({
                            id: 'contract.sold',
                            data: contract.transaction_ids.sell,
                            contract,
                        });

                        contractSettled(contract);

                        this.contractId = '';
                        // this.updateTotals(contract);
                        const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;
                        const profit = Number(
                            roundBalance({ currency, balance: Number(sellPrice) - Number(buyPrice) })
                        );
                        const win = profit > 0;
                        if (win) {
                            handleWinValue();
                        } else {
                            handleLostValue();
                        }

                        if (this.afterPromise) {
                            this.afterPromise();
                        }

                        this.store.dispatch(sell());
                        this.cancelSubscriptionTimeout();
                    } else {
                        this.store.dispatch(openContractReceived());
                        if (!this.isExpired) {
                            this.resetSubscriptionTimeoutVH();
                        }
                    }
                }
            });
        }

        waitForAfter() {
            return new Promise(resolve => {
                this.afterPromise = resolve;
            });
        }

        subscribeToOpenContract(contract_id = this.contractId) {
            if (this.contractId !== contract_id) {
                this.resetSubscriptionTimeout();
            }
            this.contractId = contract_id;

            doUntilDone(() =>
                api_base.api.send({
                    proposal_open_contract: 1,
                    contract_id,
                })
            ).catch(error => {
                observer.emit('reset_animation');
                observer.emit('Error', error);
            });
        }

        // Custom Subscribe to open Contract for VH
        subscribeToOpenContractVH(contract_id = this.contractId) {
            if (this.contractId !== contract_id) {
                this.resetSubscriptionTimeoutVH();
            }
            this.contractId = contract_id;

            doUntilDone(() =>
                api_base2.api.send({
                    proposal_open_contract: 1,
                    contract_id,
                })
            ).catch(error => {
                observer.emit('reset_animation');
                observer.emit('Error', error);
            });
        }

        resetSubscriptionTimeout(timeout = this.getContractDuration() + AFTER_FINISH_TIMEOUT) {
            this.cancelSubscriptionTimeout();
            this.subscription_timeout = setInterval(() => {
                this.subscribeToOpenContract();
                this.resetSubscriptionTimeout(timeout);
            }, timeout * 1000);
        }
        // Custo, reset sub for VH
        resetSubscriptionTimeoutVH(timeout = this.getContractDuration() + AFTER_FINISH_TIMEOUT) {
            this.cancelSubscriptionTimeout();
            this.subscription_timeout = setInterval(() => {
                this.subscribeToOpenContractVH();
                this.resetSubscriptionTimeout(timeout);
            }, timeout * 1000);
        }

        cancelSubscriptionTimeout() {
            clearTimeout(this.subscription_timeout);
        }

        setContractFlags({ is_expired, is_valid_to_sell, is_sold, entry_tick }) {
            this.isSold = !!is_sold;
            this.isSellAvailable = !this.isSold && !!is_valid_to_sell;
            this.isExpired = !!is_expired;
            this.hasEntryTick = !!entry_tick;
        }

        expectedContractId(contract_id) {
            return this.contractId && contract_id === this.contractId;
        }

        getSellPrice() {
            const { bid_price, buy_price, currency } = this.data.contract;
            return Number(roundBalance({ currency, balance: Number(bid_price) - Number(buy_price) }));
        }
        getSellPriceVH() {
            const { bid_price, buy_price, currency } = this.data.vh_contract;
            return Number(roundBalance({ currency, balance: Number(bid_price) - Number(buy_price) }));
        }
    };