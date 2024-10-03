import { api_base, api_base2 } from '@api-base';
import { translate } from '@i18n';
import { TrackJSError } from '@utilities/logger';
import { tradeOptionToProposal, doUntilDone } from '../tools';
import { proposalsReady, clearProposals } from './state/actions';
import { VH_Variables } from '../../blocks/vh_shared';

export default Engine =>
    class Proposal extends Engine {
        makeProposals(trade_option) {
            if (VH_Variables.isMartingaleActive) {
                trade_option.amount = VH_Variables.mart_stake;
            }

            if (!this.isNewTradeOption(trade_option)) {
                return;
            }

            // Generate a purchase reference when trade options are different from previous trade options.
            // This will ensure the bot doesn't mistakenly purchase the wrong proposal.
            this.regeneratePurchaseReference();
            this.trade_option = trade_option;
            this.proposalTemplates = tradeOptionToProposal(trade_option, this.getPurchaseReference());
            if (!VH_Variables.isVHActive) {
                this.renewProposalsOnPurchase();
            } else {
                const newVHPP = Object.assign(trade_option);
                newVHPP.amount = 0.35;
                this.vhProposalTemplates = tradeOptionToProposal(newVHPP, this.getPurchaseReference());
                this.renewProposalsOnPurchaseVH();
            }
        }

        selectProposal(contract_type) {
            const { proposals } = this.data;

            if (proposals.length === 0) {
                throw Error(translate('Proposals are not ready'));
            }

            const to_buy = proposals.find(proposal => {
                if (
                    proposal.contract_type === contract_type &&
                    proposal.purchase_reference === this.getPurchaseReference()
                ) {
                    // Below happens when a user has had one of the proposals return
                    // with a ContractBuyValidationError. We allow the logic to continue
                    // to here cause the opposite proposal may still be valid. Only once
                    // they attempt to purchase the errored proposal we will intervene.
                    if (proposal.error) {
                        const { error } = proposal.error;
                        const { code, message } = error;
                        throw new TrackJSError(code, message, error);
                    }

                    return proposal;
                }

                return false;
            });

            if (!to_buy) {
                throw new TrackJSError(
                    'CustomInvalidProposal',
                    translate('Selected proposal does not exist'),
                    this.data.proposals
                );
            }

            return {
                proposal: to_buy,
                currency: this.trade_option.currency,
            };
        }
        // Custom select Proposal for VH
        selectProposalVH(contract_type) {
            const { vh_proposals } = this.data;

            if (vh_proposals.length === 0) {
                throw Error(translate('Virtual Hook Proposals are not ready'));
            }

            const to_buy = vh_proposals.find(proposal => {
                if (
                    proposal.contract_type === contract_type 
                    // proposal.purchase_reference === this.getPurchaseReference()
                ) {
                    // Below happens when a user has had one of the proposals return
                    // with a ContractBuyValidationError. We allow the logic to continue
                    // to here cause the opposite proposal may still be valid. Only once
                    // they attempt to purchase the errored proposal we will intervene.
                    if (proposal.error) {
                        const { error } = proposal.error;
                        const { code, message } = error;
                        throw new TrackJSError(code, message, error);
                    }
                    return proposal;
                }

                return false;
            });

            if (!to_buy) {
                throw new TrackJSError(
                    'CustomInvalidProposal',
                    translate('Selected proposal does not exist'),
                    this.data.vh_proposals
                );
            }

            return {
                proposal: to_buy,
                currency: this.trade_option.currency,
            };
        }

        renewProposalsOnPurchase() {
            this.unsubscribeProposals().then(() => this.requestProposals());
        }

        renewProposalsOnPurchaseVH() {
            this.unsubscribeProposalsVH().then(() => this.requestProposalsVH());
        }

        clearProposals() {
            this.data.proposals = [];
            this.store.dispatch(clearProposals());
        }

        clearVHProposals(){
            this.data.vh_proposals = [];
            this.store.dispatch(clearProposals());
        }

        requestProposals() {
            Promise.all(
                this.proposalTemplates.map(proposal =>
                    doUntilDone(() => api_base.api.send(proposal)).catch(error => {
                        // We intercept ContractBuyValidationError as user may have specified
                        // e.g. a DIGITUNDER 0 or DIGITOVER 9, while one proposal may be invalid
                        // the other is valid. We will error on Purchase rather than here.
                        if (error && error.error.code === 'ContractBuyValidationError') {
                            this.data.proposals.push({
                                ...error.echo_req,
                                ...error.echo_req.passthrough,
                                error,
                            });
                            return null;
                        }

                        throw error;
                    })
                )
            ).catch(({ error }) => this.$scope.observer.emit('Error', { name: error.code, ...error }));
        }
        // Custom request Proposal for VH
        requestProposalsVH() {
            Promise.all(
                this.vhProposalTemplates.map(proposal =>
                    doUntilDone(() => api_base2.api.send(proposal)).catch(error => {
                        // We intercept ContractBuyValidationError as user may have specified
                        // e.g. a DIGITUNDER 0 or DIGITOVER 9, while one proposal may be invalid
                        // the other is valid. We will error on Purchase rather than here.
                        if (error && error.error.code === 'ContractBuyValidationError') {
                            this.data.vh_proposals.push({
                                ...error.echo_req,
                                ...error.echo_req.passthrough,
                                error,
                            });
                            return null;
                        }

                        throw error;
                    })
                )
            ).catch(({ error }) => this.$scope.observer.emit('Error', { name: error.code, ...error }));
        }

        observeProposals() {
            api_base.api.onMessage().subscribe(({ data }) => {
                if (data?.error?.code) {
                    return;
                }
                if (data?.msg_type === 'proposal') {
                    const { passthrough, proposal } = data;
                    if (
                        this.data.proposals.findIndex(p => p.id === proposal.id) === -1 &&
                        !this.data.forgetProposalIds.includes(proposal.id)
                    ) {
                        // Add proposals based on the ID returned by the API.
                        this.data.proposals.push({ ...proposal, ...passthrough });
                        this.checkProposalReady();
                    }
                }
            });
        }
        // Custom observer Proposal for VH
        observeProposalsVH() {
            api_base2.api.onMessage().subscribe(({ data }) => {
                if (data?.error?.code) {
                    return;
                }
                if (data?.msg_type === 'proposal') {
                    const { passthrough, proposal } = data;
                    if (
                        this.data.vh_proposals.findIndex(p => p.id === proposal.id) === -1 &&
                        !this.data.vh_forgetProposalIds.includes(proposal.id)
                    ) {
                        // Add proposals based on the ID returned by the API.
                        this.data.vh_proposals.push({ ...proposal, ...passthrough });
                        this.checkProposalReadyVH();
                    }
                }
            });
        }

        unsubscribeProposals() {
            const { proposals } = this.data;
            const removeForgetProposalById = forgetProposalId => {
                this.data.forgetProposalIds = this.data.forgetProposalIds.filter(id => id !== forgetProposalId);
            };

            this.clearProposals();

            return Promise.all(
                proposals.map(proposal => {
                    if (!this.data.forgetProposalIds.includes(proposal.id)) {
                        this.data.forgetProposalIds.push(proposal.id);
                    }

                    if (proposal.error) {
                        removeForgetProposalById(proposal.id);
                        return Promise.resolve();
                    }

                    return doUntilDone(() => api_base.api.forget(proposal.id)).then(() =>
                        removeForgetProposalById(proposal.id)
                    );
                })
            );
        }
        // Custom Unsubscribe Proposal
        unsubscribeProposalsVH() {
            const { vh_proposals } = this.data;
            const removeForgetProposalById = forgetProposalId => {
                this.data.vh_forgetProposalIds = this.data.vh_forgetProposalIds.filter(id => id !== forgetProposalId);
            };

            this.clearVHProposals();

            return Promise.all(
                vh_proposals.map(proposal => {
                    if (!this.data.vh_forgetProposalIds.includes(proposal.id)) {
                        this.data.vh_forgetProposalIds.push(proposal.id);
                    }

                    if (proposal.error) {
                        removeForgetProposalById(proposal.id);
                        return Promise.resolve();
                    }

                    return doUntilDone(() => api_base2.api.forget(proposal.id)).then(() =>
                        removeForgetProposalById(proposal.id)
                    );
                })
            );
        }

        checkProposalReady() {
            // Proposals are considered ready when the proposals in our memory match the ones
            // we've requested from the API, we determine this by checking the passthrough of the response.
            const { proposals } = this.data;

            if (proposals.length > 0) {
                const hasEqualProposals = this.proposalTemplates?.every(
                    template =>
                        proposals.findIndex(
                            proposal =>
                                proposal.purchase_reference === template.passthrough.purchase_reference &&
                                proposal.contract_type === template.contract_type
                        ) !== -1
                );

                if (hasEqualProposals) {
                    this.startPromise.then(() => {
                        this.store.dispatch(proposalsReady());
                    });
                }
            }
        }
        // Custom check Proposal ready for VH
        checkProposalReadyVH() {
            // Proposals are considered ready when the proposals in our memory match the ones
            // we've requested from the API, we determine this by checking the passthrough of the response.
            const { vh_proposals } = this.data;

            if (vh_proposals.length > 0) {
                const hasEqualProposals = this.proposalTemplates?.every(
                    template =>
                        vh_proposals.findIndex(
                            proposal =>
                                proposal.purchase_reference === template.passthrough.purchase_reference &&
                                proposal.contract_type === template.contract_type
                        ) !== -1
                );

                if (hasEqualProposals) {
                    this.startPromise.then(() => {
                        this.store.dispatch(proposalsReady());
                    });
                }
            }
        }

        isNewTradeOption(trade_option) {
            if (!this.trade_option) {
                this.trade_option = trade_option;
                return true;
            }

            // Compare incoming "trade_option" argument with "this.trade_option", if any
            // of the values is different, this is a new trade_option and new proposals
            // should be generated.
            return [
                'amount',
                'barrierOffset',
                'basis',
                'duration',
                'duration_unit',
                'prediction',
                'secondBarrierOffset',
                'symbol',
            ].some(value => this.trade_option[value] !== trade_option[value]);
        }
    };
