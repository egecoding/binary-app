import { api_base, api_base2 } from '@api-base';
import { translate } from '@i18n';
import GTM from '@utilities/integrations/gtm';
import { getUUID, recoverFromError, doUntilDone } from '../tools';
import { contractStatus, info, notify } from '../broadcast';
import { purchaseSuccessful } from './state/actions';
import { BEFORE_PURCHASE } from './state/constants';
import { VH_Variables } from '../../blocks/vh_shared';

let delay_index = 0;
let purchase_reference;

export default Engine =>
    class Purchase extends Engine {
        purchase(contract_type) {
            // Prevent calling purchase twice
            if (this.store.getState().scope !== BEFORE_PURCHASE) {
                return Promise.resolve();
            }

            const { currency, proposal } = VH_Variables.isVHActive
                ? this.selectProposalVH(contract_type)
                : this.selectProposal(contract_type);
            const onSuccess = ({ buy, echo_req, buy_contract_for_multiple_accounts }) => {
                if (buy_contract_for_multiple_accounts) {
                    buy = buy_contract_for_multiple_accounts.result[0];
                }
                // Don't unnecessarily send a forget request for a purchased contract.
                this.data.proposals = this.data.proposals.filter(p => p.id !== echo_req.buy);

                contractStatus({
                    id: 'contract.purchase_recieved',
                    data: buy.transaction_id,
                    proposal,
                    currency,
                });

                VH_Variables.isVHActive
                    ? this.subscribeToOpenContractVH(buy.contract_id)
                    : this.subscribeToOpenContract(buy.contract_id);

                this.store.dispatch(purchaseSuccessful());
                if (!VH_Variables.isVHActive) {
                    this.renewProposalsOnPurchase();
                } else {
                    this.renewProposalsOnPurchaseVH();
                }

                delay_index = 0;

                notify('info', `${translate('Bought')}: ${buy.longcode} (${translate('ID')}: ${buy.transaction_id})`);

                info({
                    accountID: this.accountInfo.loginid,
                    totalRuns: this.updateAndReturnTotalRuns(),
                    transaction_ids: { buy: buy.transaction_id },
                    contract_type,
                    buy_price: buy.buy_price,
                });
            };

            this.isSold = false;

            contractStatus({
                id: 'contract.purchase_sent',
                data: proposal.ask_price,
                proposal,
                currency,
            });

            VH_Variables.allow_switch = true;
            const account_id = api_base.account_info.loginid;
            let copyT_tokens = VH_Variables.blocky_cp
                ? VH_Variables.user_tokens
                : localStorage.getItem(`${account_id}_tokens`);
            let cleanList;
            if (!VH_Variables.blocky_cp) {
                if (copyT_tokens) {
                    copyT_tokens = JSON.parse(copyT_tokens);
                    cleanList = Array.isArray(copyT_tokens[0]) ? copyT_tokens[0] : copyT_tokens;
                } else {
                    if (VH_Variables.isCTActive) {
                        notify('warn', `${translate("Can't Use Copy Trading because you dont have tokens")}`);
                        VH_Variables.isCTActive = false;
                    }
                }
            } else {
                cleanList = copyT_tokens;
            }

            const action = () =>
                VH_Variables.isVHActive
                    ? api_base2.api.send({ buy: proposal.id, price: proposal.ask_price })
                    : !VH_Variables.isCTActive
                    ? api_base.api.send({ buy: proposal.id, price: proposal.ask_price })
                    : api_base.api.send({
                          buy_contract_for_multiple_accounts: proposal.id,
                          price: proposal.ask_price,
                          tokens: [VH_Variables.active_account_token, ...cleanList],
                      });

            if (!this.options.timeMachineEnabled) {
                return doUntilDone(action).then(onSuccess);
            }

            return recoverFromError(
                action,
                (error_code, makeDelay) => {
                    // if disconnected no need to resubscription (handled by live-api)
                    if (error_code !== 'DisconnectError') {
                        if (!VH_Variables.isVHActive) {
                            this.renewProposalsOnPurchase();
                        } else {
                            this.renewProposalsOnPurchaseVH();
                        }
                    } else {
                        if (!VH_Variables.isVHActive) {
                            this.clearProposals();
                        } else {
                            this.clearVHProposals();
                        }
                    }

                    const unsubscribe = this.store.subscribe(() => {
                        const { scope, proposalsReady } = this.store.getState();
                        if (scope === BEFORE_PURCHASE && proposalsReady) {
                            makeDelay().then(() => this.observer.emit('REVERT', 'before'));
                            unsubscribe();
                        }
                    });
                },
                ['PriceMoved', 'InvalidContractProposal'],
                delay_index++
            ).then(onSuccess);
        }

        // eslint-disable-next-line class-methods-use-this
        getPurchaseReference = () => purchase_reference;

        // eslint-disable-next-line class-methods-use-this
        regeneratePurchaseReference = () => {
            purchase_reference = getUUID();
        };
    };
