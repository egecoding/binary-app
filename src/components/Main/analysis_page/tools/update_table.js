import React from "react";
import { roundBalance } from "../../../../blockly/bot/helpers";
import { translate } from '@i18n';
import { isNumber, appendRow, updateRow } from '@utils';

const getProfit = ({ sell_price, buy_price, currency }) => {
    if (isNumber(sell_price) && isNumber(buy_price)) {
        return roundBalance({
            currency,
            balance: Number(sell_price) - Number(buy_price),
        });
    }
    return '';
};

const getTimestamp = (date) => {
    const buy_date = new Date(date * 1000);
    return `${buy_date.toISOString().split('T')[0]} ${buy_date.toTimeString().slice(0, 8)} ${
        buy_date.toTimeString().split(' ')[1]
    }`;
};

const getTradeObject = (contract) => {
    const trade_obj = {
        ...contract,
        reference: contract.transaction_ids.buy,
        buy_price: roundBalance({ balance: contract.buy_price, currency: contract.currency }),
        timestamp: getTimestamp(contract.date_start),
        entry_exit_spot: '',
    };

    if (contract.entry_tick) {
        trade_obj.entry_exit_spot += `${contract.entry_spot_display_value}`;
    }

    if (contract.exit_tick) {
        if (trade_obj.entry_exit_spot) {
            trade_obj.entry_exit_spot += ' / ';
        }
        trade_obj.entry_exit_spot += `${contract.exit_tick_display_value}`;
    }

    return trade_obj;
};

export const contractBot = (contract,setAccountState,getAccountStateById) => {
    if (!contract) return;
    const trade_obj = getTradeObject(contract);
    const trade = {
        ...trade_obj,
        profit:  getProfit(trade_obj),
        contract_status: translate(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d0021b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>),
        contract_settled: false,
    };
    const trade_obj_account_id = trade_obj.accountID;
    const account_state_by_id = getAccountStateById(trade_obj_account_id);
    const trade_obj_state_rows = account_state_by_id.rows;
    const prev_row_index = trade_obj_state_rows.findIndex((t) => t.reference === trade.reference);
    if (trade.is_expired && trade.is_sold && !trade.exit_tick) {
        trade.exit_tick = '-';
    }
    if (prev_row_index >= 0) {
        setAccountState({ [trade_obj_account_id]: updateRow(prev_row_index, trade, account_state_by_id) });
    } else {
        setAccountState({ [trade_obj_account_id]: appendRow(trade, account_state_by_id) });
    }
};