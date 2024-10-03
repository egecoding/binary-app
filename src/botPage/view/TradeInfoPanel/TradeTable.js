/* eslint-disable no-await-in-loop */
import { Parser } from 'json2csv';
import React from 'react';
import Draggable from 'react-draggable';
import { Table, Column } from 'react-virtualized';
import PropTypes from 'prop-types';
import { api_base, api_base2 } from '@api-base';
import { translate } from '@i18n';
import { isNumber, saveAs, appendRow, updateRow } from '@utils';
import { observer as globalObserver } from '@utilities/observer';
import * as style from '@components/style';
import { roundBalance } from '../../../blockly/bot/helpers';
import { VH_Variables } from '../../../blockly/blocks/vh_shared';

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

const ProfitColor = ({ value, isVHActive, rowIndex }) => {
    const isVirtual = isVHActive && rowIndex === 0;
    return (
        <div
            id={`row-${rowIndex}`}
            style={isVirtual ? style.blueLeft : value > 0 || value === 'virtual won' ? style.greenLeft : style.redLeft}
        >
            {isVirtual ? 'virtual' : value}
        </div>
    );
};

ProfitColor.propTypes = {  
    value: PropTypes.string,
    isVHActive: PropTypes.bool,
    rowIndex: PropTypes.number,
};

const StatusFormat = ({ value }) => <div style={style.left}>{value}</div>;
StatusFormat.propTypes = {
    value: PropTypes.string,
};

const TradeTable = ({ account_id }) => {
    const initial_state = { id: 0, rows: [] };
    const [account_state, setAccountState] = React.useState({ [account_id]: initial_state });

    const actual_account_state_ref = React.useRef(account_state);
    actual_account_state_ref.current = account_state;

    const rows = account_id in account_state ? account_state[account_id].rows : [];

    const total_width = 750;
    const min_height = 290;
    const row_height = 30; // Adjusted height for the custom cell

    const columns = [
        { key: 'contract_status',  width: 25 },
        { key: 'reference', label: translate('Reference'), width: 85 },
        { key: 'contract_type', label: translate('Trade type'), width: 70 },
        { key: 'entry_exit_spot', label: translate('spot'), width: 70 },
        { key: 'buy_price', label: translate('Buy price'), width: 70 },
        { key: 'profit', label: translate('Profit/Loss'), width: 70 },
        { key: 'timestamp', label: translate('Timestamp'), width: 180 },
    ];

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

    const exportSummary = () => {
        if (account_state[account_id]?.rows?.length > 0) data_export();
    };

    const clearBot = () => {
        setAccountState({ [account_id]: { ...initial_state } });
        globalObserver.emit('summary.disable_clear');
    };

    const stopBot = () => {
        if (account_state[account_id]?.rows?.length > 0) globalObserver.emit('summary.enable_clear');
    };

    const contractBot = (contract) => {
        if (!contract) return;
        const trade_obj = getTradeObject(contract);
        const trade = {
            ...trade_obj,
            profit: VH_Variables.isVHActive
                ? parseFloat(getProfit(trade_obj)) > 0
                    ? 'virtual won'
                    : 'virtual lost'
                : getProfit(trade_obj),
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

    const settledContract = async ({ contract_id }) => {
        let settled = false;
        let delay = 3000;

        const sleep = () =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, delay);
            });

        while (!settled) {
            await sleep();
            try {
                await refreshContract(contract_id);
                const {rows} = account_state[account_id];
                const contract_row = rows.find((row) => row.contract_id === contract_id);
                if (contract_row && contract_row.contract_settled) {
                    settled = true;
                }
            } catch (e) {
                // Do nothing. Loop again.
            } finally {
                delay *= 1.5;
            }
        }
    };

    const refreshContract = async (contract_id) => {
        const contract_info = VH_Variables.isVHActive
            ? await api_base2.api.send({ proposal_open_contract: 1, contract_id }).catch((e) => {
                globalObserver.emit('Error', e);
            })
            : await api_base.api.send({ proposal_open_contract: 1, contract_id }).catch((e) => {
                globalObserver.emit('Error', e);
            });

        if (contract_info) {
            const contract = contract_info.proposal_open_contract;
            const trade_obj = getTradeObject(contract);
            const trade = {
                ...trade_obj,
                profit: VH_Variables.isVHActive
                    ? parseFloat(getProfit(trade_obj)) > 0
                        ? 'virtual won'
                        : 'virtual lost'
                    : getProfit(trade_obj),
            };
            if (trade.is_expired && trade.is_sold && !trade.exit_tick) {
                trade.exit_tick = '-';
            }

            const actual_rows = actual_account_state_ref.current[account_id].rows;
            const updated_rows = actual_rows.map((row) => {
                const { reference } = row;
                if (reference === trade.reference) {
                    return {
                        contract_status: translate(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>),
                        contract_settled: true,
                        reference,
                        ...trade,
                    };
                }
                return row;
            });
            setAccountState({ [account_id]: { rows: updated_rows } });
        }
    };

    React.useEffect(() => {
        globalObserver.register('summary.export', exportSummary);
        globalObserver.register('summary.clear', clearBot);
        globalObserver.register('bot.stop', stopBot);
        globalObserver.register('bot.contract', contractBot);
        globalObserver.register('contract.settled', settledContract);

        return () => {
            globalObserver.unregister('summary.export', exportSummary);
            globalObserver.unregister('summary.clear', clearBot);
            globalObserver.unregister('bot.stop', stopBot);
            globalObserver.unregister('bot.contract', contractBot);
            globalObserver.unregister('contract.settled', settledContract);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account_state]);

    const rowGetter = ({ index }) => {
        const got_rows = account_state[account_id].rows;
        return got_rows[got_rows.length - 1 - index];
    };

    const data_export = () => {
        const to_data_rows = account_state[account_id].rows.map((item, index) => {
            const to_data_row = item;
            to_data_row.id = index + 1;
            return to_data_row;
        });

        const json2csvParser = new Parser({
            fields: [
                'id',
                'timestamp',
                'reference',
                'contract_type',
                'entry_exit_spot',
                'buy_price',
                'sell_price',
                'profit',
            ],
        });
        const data = json2csvParser.parse(to_data_rows);

        saveAs({ data, filename: 'logs.csv', type: 'text/csv;charset=utf-8' });
    };

    const getAccountStateById = (_account_id) => {
        if (account_id in account_state) return account_state[account_id];
        setAccountState({ [_account_id]: { ...initial_state } });
        return initial_state;
    };

    const headerRenderer = ({ dataKey, label }) => {
        const headerIndex = columns.findIndex((col) => col.key === dataKey);
        const isLastColumn = headerIndex + 1 === columns.length;

        return (
            <React.Fragment key={dataKey}>
                <div className='ReactVirtualized__Table__headerTruncatedText'>{label}</div>
                {!isLastColumn && (
                    <Draggable
                        axis='x'
                        defaultClassName='DragHandle'
                        defaultClassNameDragging='DragHandleActive'
                        position={{ x: 0 }}
                        zIndex={999}
                    >
                        <span className='DragHandleIcon' />
                    </Draggable>
                )}
            </React.Fragment>
        );
    };

    const cellRenderer = ({ cellData, dataKey, rowIndex, columnIndex }) => {
        const isEvenRow = rowIndex % 2 === 0;
        const backgroundColor = isEvenRow ? 'transparent' : 'transparent';
    
        const cellStyle = {
            backgroundColor: backgroundColor,
            padding: '5px', // Add any additional styling as needed
        };
    
        if (dataKey === 'profit') {
            return <ProfitColor value={cellData} isVHActive={VH_Variables.isVHActive} rowIndex={rowIndex} />;
        }
    
        if (dataKey === 'contract_status') {
            return <StatusFormat value={cellData} />;
        }
    
        if (dataKey === 'entry_exit_spot') {
            const entryExitSpots = cellData.split('/');
    
            return (
                <div style={cellStyle}>
                    {entryExitSpots.map((spot, index) => (
                        <span key={index} className="ml-1" style={{ display: 'block' }}>
                            {/* Removed SVG elements */}
                            {spot.trim()}
                        </span>
                    ))}
                </div>
            );
        }
    
        return <div style={cellStyle}>{cellData}</div>;
    };
    
    return (
        <div>
            <Table
                width={total_width}
                height={min_height}
                headerHeight={row_height}
                rowHeight={row_height}
                rowCount={rows.length}
                rowGetter={rowGetter}
                headerStyle={{
                    fontSize: 11,
                    textTransform: 'capitalize',
                }}
            >
                {columns.map(({ label, key, width }, index) => (
                    <Column
                        headerRenderer={headerRenderer}
                        cellRenderer={cellRenderer}
                        width={width}
                        key={index}
                        label={label}
                        dataKey={key}
                    />
                ))}
            </Table>
        </div>
    );
};

TradeTable.propTypes = {
    account_id: PropTypes.string,
};

export default TradeTable;