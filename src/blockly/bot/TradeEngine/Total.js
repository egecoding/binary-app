import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import { roundBalance } from '../helpers';
import { info, notify } from '../broadcast';
import { createError } from '../../../botPage/common/error';
import {
    calculateLostStatus,
    calculateWonStatus,
    handleLostLiveStep,
    handleWonLiveStep,
    resetMartingaleVars,
} from '../../blocks/tools/vh_functions';
import { VH_Variables } from '../../blocks/vh_shared';

const skeleton = {
    totalProfit: 0,
    totalWins: 0,
    totalLosses: 0,
    totalStake: 0,
    totalPayout: 0,
    totalRuns: 0,
};

const globalStat = {};

export default Engine =>
    class Total extends Engine {
        constructor() {
            super();
            this.sessionRuns = 0;
            this.sessionProfit = 0;

            globalObserver.register('summary.clear', () => {
                this.sessionRuns = 0;
                this.sessionProfit = 0;

                const { loginid: accountID } = this.accountInfo;
                globalStat[accountID] = { ...skeleton };
            });
        }
        updateTotals(contract) {
            const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;

            const profit = Number(roundBalance({ currency, balance: Number(sellPrice) - Number(buyPrice) }));

            const win = profit > 0;

            const accountStat = this.getAccountStat();

            accountStat.totalWins += win ? 1 : 0;

            accountStat.totalLosses += !win ? 1 : 0;

            this.sessionProfit = roundBalance({ currency, balance: Number(this.sessionProfit) + Number(profit) });

            accountStat.totalProfit = roundBalance({
                currency,
                balance: Number(accountStat.totalProfit) + Number(profit),
            });
            accountStat.totalStake = roundBalance({
                currency,
                balance: Number(accountStat.totalStake) + Number(buyPrice),
            });
            accountStat.totalPayout = roundBalance({
                currency,
                balance: Number(accountStat.totalPayout) + Number(sellPrice),
            });
            info({
                profit,
                contract,
                accountID: this.accountInfo.loginid,
                totalProfit: accountStat.totalProfit,
                totalWins: accountStat.totalWins,
                totalLosses: accountStat.totalLosses,
                totalStake: accountStat.totalStake,
                totalPayout: accountStat.totalPayout,
            });

            if (win) {
                notify('success', `${translate('Profit Made by Binarytool')}: ${profit}`);
                if (VH_Variables.allow_VH) {
                    handleWonLiveStep(parseFloat(accountStat.totalProfit));
                } else {
                    calculateWonStatus(parseFloat(accountStat.totalProfit));
                }
            } else {
                notify('error', `${translate('Loss Made by Binarytool.site')}: ${profit}`);
                // Calculating built in VH and RiskMangment martingale
                if (VH_Variables.allow_VH) {
                    handleLostLiveStep(profit, parseFloat(accountStat.totalProfit));
                } else {
                    const isRunning = globalObserver.getState('isRunning');
                    if(isRunning){
                        calculateLostStatus(profit, parseFloat(accountStat.totalProfit));
                    }else{
                        resetMartingaleVars();
                    }
                }
            }
        }
        updateAndReturnTotalRuns() {
            this.sessionRuns++;
            const accountStat = this.getAccountStat();

            return ++accountStat.totalRuns;
        }
        /* eslint-disable class-methods-use-this */
        getTotalRuns() {
            const accountStat = this.getAccountStat();
            return accountStat.totalRuns;
        }
        getTotalProfit(toString, currency) {
            const accountStat = this.getAccountStat();
            return toString && accountStat.totalProfit !== 0
                ? roundBalance({
                    currency,
                    balance: +accountStat.totalProfit,
                })
                : +accountStat.totalProfit;
        }
        /* eslint-enable */
        checkLimits(tradeOption) {
            if (!tradeOption.limitations) {
                return;
            }

            const {
                limitations: { maxLoss, maxTrades },
            } = tradeOption;

            if (maxLoss && maxTrades) {
                if (this.sessionRuns >= maxTrades) {
                    throw createError('CustomLimitsReached', translate('Maximum number of trades reached'));
                }
                if (this.sessionProfit <= -maxLoss) {
                    throw createError('CustomLimitsReached', translate('Maximum loss amount reached'));
                }
            }
        }
        getAccountStat() {
            const { loginid: accountID } = this.accountInfo;

            if (!(accountID in globalStat)) {
                globalStat[accountID] = { ...skeleton };
            }

            return globalStat[accountID];
        }
    };