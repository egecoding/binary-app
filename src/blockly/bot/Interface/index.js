/* eslint-disable max-classes-per-file */
import { VH_Variables } from '../../blocks/vh_shared';
import TradeEngine from '../TradeEngine';
import { createDetails } from '../tools';
import TicksInterface from './TicksInterface';
import ToolsInterface from './ToolsInterface';

/**
 * Bot - Bot Module
 * @namespace Bot
 */

export default class Interface extends ToolsInterface(TicksInterface(class {})) {
    constructor($scope) {
        super();
        this.tradeEngine = new TradeEngine($scope);
        this.observer = $scope.observer;
        this.$scope = $scope;
    }
    getInterface(name = 'Global') {
        if (name === 'Bot') {
            return {
                ...this.getBotInterface(),
                ...this.getToolsInterface(),
            };
        }
        return {
            watch: (...args) => this.tradeEngine.watch(...args),
            sleep: (...args) => this.sleep(...args),
            alert: (...args) => alert(...args), // eslint-disable-line no-alert
            prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
            console: {
                log(...args) {
                    // eslint-disable-next-line no-console
                    console.log(new Date().toLocaleTimeString(), ...args);
                },
            },
        };
    }
    getBotInterface() {
        const getDetail = (i, pipSize) =>
            createDetails(
                VH_Variables.isVHActive ? this.tradeEngine.data.vh_contract : this.tradeEngine.data.contract,
                pipSize
            )[i];

        return {
            init: (...args) => this.tradeEngine.init(...args),
            start: (...args) => this.tradeEngine.start(...args),
            stop: (...args) => this.tradeEngine.stop(...args),
            purchase: (...args) => this.tradeEngine.purchase(...args),
            getPurchaseReference: () => this.tradeEngine.getPurchaseReference(),
            getAskPrice: contractType => Number(this.getProposal(contractType).ask_price),
            getPayout: contractType => Number(this.getProposal(contractType).payout),
            isSellAvailable: () => this.tradeEngine.isSellAtMarketAvailable(),
            sellAtMarket: () => this.tradeEngine.sellAtMarket(),
            getSellPrice: () => this.getSellPrice(),
            isResult: result => getDetail(10) === result,
            readDetails: i => getDetail(i - 1, this.tradeEngine.getPipSize()),
            vhAccountSwitcher: mode => this.vhAccountSwitcher(mode),
            AccountTypeStatus: () => this.AccountTypeStatus(),
        };
    }
    sleep(arg = 1) {
        return new Promise(
            r =>
                // eslint-disable-next-line no-promise-executor-return
                setTimeout(() => {
                    r();
                    setTimeout(() => this.observer.emit('CONTINUE'), 0);
                }, arg * 1000),
            () => {}
        );
    }
    getProposal(contract_type) {
        return this.tradeEngine.data.proposals.find(
            proposal =>
                proposal.contract_type === contract_type &&
                proposal.purchase_reference === this.tradeEngine.getPurchaseReference()
        );
    }
    getSellPrice() {
        return this.tradeEngine.getSellPrice();
    }

    // Custom Account Switcher
    /* eslint-disable class-methods-use-this */
    vhAccountSwitcher(mode) {
        let result = ''; // Placeholder string
        if (mode === 'main') {
            VH_Variables.isVHActive = false;
            result = 'Switching to real account';
        } else if (mode === 'virtual') {
            VH_Variables.isVHActive = true;
            result = 'Switching to Virtual Hook account';
        } else {
            result = `'Invalid Choice:' ${mode}`;
        }
        return result;
    }

    AccountTypeStatus = () => (VH_Variables.isVHActive ? 1 : 0);
}
