import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import Draggable from 'react-draggable';
import './stat_table.css';

const ContractTable = ({ contracts, onClose, total_profit, clear_trash }) => {
    return (
        <Draggable>
            <div className='table-container'>
                <div className='top_container'>
                    <div className='close-icon' onClick={() => clear_trash()}>
                        <FaRegTrashCan />
                    </div>
                    <div className='close-icon' onClick={() => onClose(false)}>
                        <FaTimes />
                    </div>
                </div>
                <div className='scrollable-table'>
                    <table className='contract-table'>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Reference</th>
                                <th>Trade Type</th>
                                <th>Spot</th>
                                <th>Buy Price</th>
                                <th>Profit/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map((contract, index) => (
                                <tr key={index}>
                                    <td className='status-cell'>
                                        {contract.isWon ? (
                                            contract.profitLoss > 0 ? (
                                                <FaCheckCircle className='won-icon' />
                                            ) : (
                                                <FaTimesCircle className='loss-icon' />
                                            )
                                        ) : (
                                            <FaClockRotateLeft className='pending-icon' />
                                        )}
                                    </td>
                                    <td>{contract.reference}</td>
                                    <td>{contract.tradeType}</td>
                                    <td>{contract.spot}</td>
                                    <td>{contract.buyPrice}</td>
                                    <td className={contract.profitLoss > 0 ? 'profit' : 'loss'}>
                                        {contract.profitLoss}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='bottom_container'>
                    <h3>
                        Total profit: <span className={total_profit > 0 ? 'profit' : 'loss'}>${total_profit.toFixed(2)}</span>
                    </h3>
                </div>
            </div>
        </Draggable>
    );
};

export default ContractTable;
