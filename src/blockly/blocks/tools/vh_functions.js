import { notify } from '../../bot/broadcast';
import { VH_Variables } from '../vh_shared';

// Custom Functions(When VH is active) --------------
export const handleLostValue = () => {
    if (VH_Variables.max_steps === VH_Variables.current_step) {
        VH_Variables.isVHActive = false;
        VH_Variables.current_step = 1;
    } else {
        VH_Variables.isVHActive = true;
        VH_Variables.current_step++;
    }
};

export const handleWinValue = () => {
    VH_Variables.isVHActive = true;
    VH_Variables.current_step = 1;
};

export const handleWonLiveStep = total_profit => {
    if (total_profit >= VH_Variables.take_profit) {
        VH_Variables.isVHActive = false;
        VH_Variables.current_step = 1;
        VH_Variables.current_trades_real = 0;
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
        alert('Take Profit Hitted!!')
        // notify('success', 'Take Profit Hitted!!');
        VH_Variables.global_blocky.stop();
    } else {
        VH_Variables.current_trades_real++;
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
        if (VH_Variables.current_trades_real >= VH_Variables.min_trades_real) {
            VH_Variables.isVHActive = true;
            VH_Variables.current_step = 1;
            VH_Variables.current_trades_real = 0;
        }
    }
};

export const handleLostLiveStep = (profit, total_profit) => {
    const sl = VH_Variables.stop_loss * -1;
    if (total_profit <= sl) {
        VH_Variables.isVHActive = false;
        VH_Variables.current_step = 1;
        VH_Variables.current_trades_real = 0;
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
        alert('Stop Loss Hitted!!')
        // notify('warn', 'Stop Loss Hitted!!');
        VH_Variables.global_blocky.stop();
    } else {
        VH_Variables.current_trades_real++;
        if (VH_Variables.allow_martingale === true) {
            VH_Variables.isMartingaleActive = true;
            calculateMartingale(profit);
        }
    }
};

export const calculateMartingale = profit => {
    // VH_Variables.mart_total_lost += Math.abs(profit);
    const current_lost = Math.abs(profit);
    const newStake = current_lost * VH_Variables.martingale_factor;
    VH_Variables.mart_stake = Math.round(newStake * 100) / 100;
};

// Custom Functions(When VH is Disabled)
export const calculateWonStatus = total_profit => {
    if (total_profit >= VH_Variables.take_profit) {
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
        notify('success', 'Take Profit Hitted!!');
        VH_Variables.global_blocky.stop();
    } else {
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
    }
};

export const calculateLostStatus = (profit, total_profit) => {
    const sl = VH_Variables.stop_loss * -1;
    if (total_profit <= sl) {
        VH_Variables.isMartingaleActive = false;
        VH_Variables.mart_total_lost = 0;
        notify('warn', 'Stop Loss Hitted!!');
        VH_Variables.global_blocky.stop();
    } else if (VH_Variables.allow_martingale === true) {
        VH_Variables.isMartingaleActive = true;
        calculateMartingale(profit);
    }
};

export const resetMartingaleVars = ()=>{
    // Switching VH off incase its active
    VH_Variables.isVHActive = false;
    VH_Variables.current_step = 1;
    VH_Variables.current_trades_real = 0;
    VH_Variables.isMartingaleActive = false;
    VH_Variables.mart_total_lost = 0;
}
// ----------------------
