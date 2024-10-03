import React, { useState, useEffect, useRef } from 'react';
import { api_base4, api_base } from '../../../api-base';
import RiseFallBarChart from './components/rf_bar_chart';
import OverUnderBarChart from './components/ou_bar_chart';
import BLineChart from './components/linechart';
import MyResponsivePie from './components/pie_chart';
import DiffersBalls from './components/differs_balls';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import './style.css';
import ContractTable from './components/stat_table';

const MainAnalysis = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [currentTick, setCurrentTick] = useState('Loading...');
    const [lastDigit, setLastDigit] = useState(0);
    const [numberOfTicks, setNumberOfTicks] = useState(50);
    const [allLastDigitList, setAllLastDigitList] = useState([]);
    const [active_symbol, setActiveSymbol] = useState('R_100');
    const [prev_symbol, setPrevSymbol] = useState('R_100');
    const [pip_size, setPipSize] = useState(2);
    const [optionsList, setOptions] = useState([]);
    const [accountCurrency, setAccountCurrency] = useState('');
    const [overValue, setOverValue] = useState(4);
    const [oneClickDuration, setOneClickDuration] = useState(1);
    const [oneClickAmount, setOneClickAmount] = useState(0.5);
    const [underValue, setUnderValue] = useState(4);
    const [isOneClickActive, setIsOneClickActive] = useState(false);
    const [isOverUnderOneClickActive, setIsOverUnderOneClickActive] = useState(false);
    const [isTradeActive, setIsTradeActive] = useState(false);
    const [martingaleValue, setMartingaleValue] = useState(1.2);
    const [percentageValue, setPercentageValue] = useState(60);
    const [overUnderContract, setOverUnderContract] = useState('DIGITOVER');
    const [isTickChart, setIsTickChart] = useState(true);
    const [isRiseFallOneClickActive, setIsRiseFallOneClickActive] = useState(false);
    const [isEvenOddOneClickActive, setIsEvenOddOneClickActive] = useState(false);
    const [evenOddContract, setEvenOddContract] = useState('DIGITEVEN');
    const [isAutoClickerActive, setIsAutoClickerActive] = useState(false);
    const [oneClickContract, setOneClickContract] = useState('DIGITDIFF');
    const [prevLowestValue, setPrevLowestValue] = useState('');
    const [showStatTable, setShowStatTable] = useState(false);
    const [contractList, setContractList] = useState([]);
    

    // Refs
    const digitDiffHigh = useRef({ appearence: 0, value: 0 });
    const digitDiffLow = useRef({ appearence: 0, value: 0 });
    const oneClickDefaultAmount = useRef(0.5);
    const martingaleValueRef = useRef(martingaleValue);
    const isTradeActiveRef = useRef(isTradeActive);
    const contractTradeTypes = useRef(['DIGITODD', 'DIGITEVEN', 'DIGITOVER', 'DIGITUNDER', 'DIGITDIFF']);
    const current_contractids = useRef([]);
    const totalLostAmount = useRef(0);
    const totalProfit = useRef(0);
    const contractListRefs = useRef(contractList);
    const isTotalProfitAdded = useRef(false);
    const tradedContracts = useRef([]);

    useEffect(() => {
        if (prev_symbol !== active_symbol) {
            api_base4.api.send({
                ticks_history: active_symbol,
                adjust_start_time: 1,
                count: 5000,
                end: 'latest',
                start: 1,
                style: 'ticks',
            });
        }
        setPrevSymbol(active_symbol);
    }, [active_symbol]);
    

    useEffect(() => {
        startApi();
    }, []);

    const clearTrash = () => {
        contractListRefs.current = [];
        setContractList([]);
        totalProfit.current = 0;
        isTotalProfitAdded.current = false;
    };

    const removeFirstElement = () => {
        setAllLastDigitList(prevList => prevList.slice(1));
    };

    const getLastDigits = (tick, pip_size) => {
        let lastDigit = tick.toFixed(pip_size);
        lastDigit = String(lastDigit).slice(-1);
        return Number(lastDigit);
    };
    const startApi = async () => {
        if (!isSubscribed) {
            api_base4.api.send({
                active_symbols: 'brief',
                product_type: 'basic',
            });
            setIsSubscribed(true);
        }

        if (api_base4.api) {
            api_base4.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'tick') {
                    const { tick } = data;
                    const { ask, id, pip_size } = tick;
                    const last_digit = getLastDigits(ask, pip_size);

                    setLastDigit(last_digit);
                    setCurrentTick(ask);
                    removeFirstElement();
                    setAllLastDigitList(prevList => [...prevList, ask]);
                }

                if (data.msg_type === 'history') {
                    const { history, pip_size } = data;
                    setPipSize(pip_size);
                    const { prices } = history;
                    const { ticks_history } = data.echo_req;
                    setAllLastDigitList(prices);
                    setActiveSymbol(ticks_history);
                    api_base4.api.send({
                        ticks: ticks_history,
                        subscribe: 1,
                    });
                }

                if (data.msg_type === 'active_symbols') {
                    const { active_symbols } = data;
                    const filteredSymbols = active_symbols.filter(symbol => symbol.subgroup === 'synthetics');
                    filteredSymbols.sort((a, b) => a.display_order - b.display_order);
                    api_base4.api.send({
                        ticks_history: filteredSymbols[0].symbol,
                        adjust_start_time: 1,
                        count: 5000,
                        end: 'latest',
                        start: 1,
                        style: 'ticks',
                    });
                    setOptions(filteredSymbols);
                }
            });
        }

        if (api_base.api) {
            api_base.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'buy') {
                    const { buy, echo_req } = data;
                    const contract_bought = {
                        isWon: false,
                        reference: buy.contract_id,
                        tradeType: echo_req.parameters.contract_type,
                        spot: '-',
                        buyPrice: buy.buy_price,
                        profitLoss: '-',
                    };
                    setContractList([...contractListRefs.current, contract_bought]);
                    contractListRefs.current.push(contract_bought);
                    tradedContracts.current.push(buy.contract_id);
                }
                if (data.msg_type === 'proposal_open_contract') {
                    const { proposal_open_contract } = data;
                    const contract = proposal_open_contract.contract_type;
                    const contract_ID = proposal_open_contract.contract_id;

                    if (!current_contractids.current.includes(contract_ID)) {
                        updateContract(
                            contract_ID,
                            proposal_open_contract.entry_spot,
                            proposal_open_contract.profit,
                            proposal_open_contract.is_sold
                        );
                    }

                    if (
                        contractTradeTypes.current.includes(contract) &&
                        tradedContracts.current.includes(contract_ID)
                    ) {
                        if (proposal_open_contract.is_sold) {
                            tradedContracts.current = tradedContracts.current.filter(number => number !== contract_ID);
                            totalProfit.current += proposal_open_contract.profit;
                            if (proposal_open_contract.status === 'lost') {
                                if (!current_contractids.current.includes(contract_ID)) {
                                    totalLostAmount.current += Math.abs(proposal_open_contract.profit);
                                    let newStake;
                                    if (contract === 'DIGITDIFF') {
                                        newStake = totalLostAmount.current * 12.5;
                                    } else {
                                        newStake = totalLostAmount.current * parseFloat(martingaleValueRef.current);
                                    }
                                    setOneClickAmount(parseFloat(newStake.toFixed(2)));
                                }
                            } else {
                                totalLostAmount.current = 0;
                                setOneClickAmount(oneClickDefaultAmount.current);
                            }

                            updateContract(
                                contract_ID,
                                proposal_open_contract.entry_spot,
                                proposal_open_contract.profit,
                                proposal_open_contract.is_sold
                            );
                            if (!current_contractids.current.includes(contract_ID)) {
                                if (isTradeActiveRef.current) {
                                    isTradeActiveRef.current = false;
                                }
                                setIsTradeActive(false);
                                current_contractids.current.push(contract_ID);
                            }
                        }
                    }
                    // updateResultsCompletedContract(proposal_open_contract);
                }
            });
        }
        setAccountCurrency(api_base.account_info.currency);
    };

    const selectTickList = () => {
        return (
            <>
                <select name='intervals' id='contract_duration' onChange={handleDurationSelect}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                    <option value='9'>9</option>
                </select>
                <div className='oneclick_amout'>
                    <input type='number' value={oneClickAmount} onChange={handleOneClickAmountInputChange} />
                    <small className='user_currency'>{accountCurrency}</small>
                </div>
            </>
        );
    };

    const updateContract = (reference, newSpot, newProfitLoss, is_sold) => {
        const updatedList = contractListRefs.current.map(contract =>
            contract.reference === reference
                ? { ...contract, spot: newSpot, profitLoss: newProfitLoss, isWon: is_sold }
                : contract
        );

        setContractList(updatedList);
        contractListRefs.current = updatedList;
    };

    // handle Functions
    const handleSelectChange = event => {
        const selectedValue = event.target.value;
        api_base4.api.forgetAll('ticks').then(() => {
            setCurrentTick('Loading...');
            setActiveSymbol(selectedValue);
        });
    };

    const handleOneClickAmountInputChange = event => {
        const newValue = event.target.value;
        setOneClickAmount(newValue === '' ? '' : Number(newValue));
        oneClickDefaultAmount.current = newValue === '' ? '' : Number(newValue);
    };

    const handleContractSelect = event => {
        const selectedValue = event.target.value;
        setOneClickContract(selectedValue);
    };

    const handleOverInputChange = event => {
        const newValue = event.target.value;
        setOverValue(newValue === '' ? '' : Number(newValue));
    };

    const handleInputChange = event => {
        const newValue = event.target.value;
        setNumberOfTicks(newValue === '' ? '' : Number(newValue));
    };

    const handleUnderInputChange = event => {
        const newValue = event.target.value;
        setUnderValue(newValue === '' ? '' : Number(newValue));
    };

    const handleIsRiseFallOneClick = () => {
        setIsRiseFallOneClickActive(!isRiseFallOneClickActive);
    };

    const handleIsOverUnderOneClick = () => {
        setIsOverUnderOneClickActive(!isOverUnderOneClickActive);
    };

    const handleOverUnderContractSelect = event => {
        const selectedValue = event.target.value;
        setOverUnderContract(selectedValue);
    };

    const handleDurationSelect = event => {
        const selectedValue = event.target.value;
        setOneClickDuration(Number(selectedValue));
    };

    const handleMartingaleInputChange = event => {
        const newValue = event.target.value;
        martingaleValueRef.current = newValue === '' ? '' : Number(newValue);
        setMartingaleValue(newValue === '' ? '' : Number(newValue));
    };
    const handlePercentageInputChange = event => {
        const newValue = event.target.value;
        setPercentageValue(newValue === '' ? '' : Number(newValue));
    };

    const handleIsOneClick = () => {
        setIsOneClickActive(!isOneClickActive);
    };

    const handleIsAutoClicker = () => {
        setIsAutoClickerActive(!isAutoClickerActive);
    };

    const handleLineChartSelectChange = event => {
        const selectedValue = event.target.value;
        if (selectedValue === 'risefall') {
            setIsTickChart(true);
        } else if (selectedValue === 'lastdigit') {
            setIsTickChart(false);
        }
    };

    const handleEvenOddContractSelect = event => {
        const selectedValue = event.target.value;
        setEvenOddContract(selectedValue);
    };

    const getLastDigitList = () => {
        const requiredItems = allLastDigitList.slice(-numberOfTicks);
        const returnedList = [];
        requiredItems.forEach(tick => {
            const last_digit = getLastDigits(tick, pip_size);
            returnedList.push(last_digit);
        });

        return returnedList;
    };

    const handleIsEvenOddOneClick = () => {
        setIsEvenOddOneClickActive(!isEvenOddOneClickActive);
    };

    const getLineChartList = () => {
        const requiredItems = allLastDigitList.slice(-numberOfTicks);
        const returnedList = [];
        let previous_tick = 0;
        let tick_difference = 0;
        requiredItems.forEach(tick => {
            const last_digit = getLastDigits(tick, pip_size);
            if (previous_tick !== 0) {
                tick_difference = tick - previous_tick;
                previous_tick = tick;
            } else {
                previous_tick = tick;
                tick_difference = tick;
            }
            returnedList.push({
                name: isTickChart ? tick.toString() : last_digit.toString(),
                value: isTickChart ? parseFloat(tick_difference.toFixed(2)) : last_digit,
            });
        });

        return returnedList;
    };

    // =============================
    const buy_contract = (contract_type, isTradeActive) => {
        if (isTradeActive) {
            api_base.api.send({
                buy: '1',
                price: oneClickAmount,
                subscribe: 1,
                parameters: {
                    amount: oneClickAmount,
                    basis: 'stake',
                    contract_type,
                    currency: 'USD',
                    duration: oneClickDuration,
                    duration_unit: 't',
                    symbol: active_symbol,
                },
            });
        }
    };

    return (
        <div className='main_app'>
            {showStatTable && (
                <ContractTable
                    contracts={contractList}
                    onClose={setShowStatTable}
                    total_profit={totalProfit.current}
                    clear_trash={clearTrash}
                />
            )}
            
            <div className='top_bar'>
                <div className='symbol_price'>
                    <div className='active_symbol'>
                        <select name='' id='symbol_options' onChange={handleSelectChange}>
                            {optionsList.length > 0 ? (
                                optionsList.map(option => (
                                    <option key={option.symbol} value={option.symbol}>
                                        {option.display_name}
                                    </option>
                                ))
                            ) : (
                                <option value=''>Loading...</option>
                            )}
                        </select>
                    </div>
                    <div className='no_of_ticks'>
                        <input type='number' name='' id='' value={numberOfTicks} onChange={handleInputChange} />
                    </div>
                    <div className='current_price'>
                        <small>{currentTick.toString()}</small>
                    </div>
                    <div className='summary_pop' onClick={() => setShowStatTable(!showStatTable)}>
                        <IoMdInformationCircleOutline />
                    </div>
                </div>
            </div>



            {/* Bottom Cards */}
            <div className='pie_diff'>
                <div className='digit_diff card3'>
                    <div className='title_oc_trader'>
                        <h2 className='analysis_title'>Differs/Matches</h2>
                        <div className='oneclick_trader'>
                            <input type='checkbox' checked={isOneClickActive} onChange={handleIsOneClick} />
                            <select name='ct_types' id='contract_types' onChange={handleContractSelect}>
                                <option value='DIGITDIFF'>Differs</option>
                                <option value='DIGITMATCH'>Matches</option>
                            </select>
                            {selectTickList()}
                        </div>
                    </div>
                    <DiffersBalls
                        lastDigitList={getLastDigitList()}
                        active_last={lastDigit}
                        active_symbol={active_symbol}
                        contract_type={oneClickContract}
                        duration={oneClickDuration}
                        isOneClickActive={isOneClickActive}
                        stake_amount={oneClickAmount}
                        prevLowestValue={prevLowestValue}
                        isAutoClickerActive={isAutoClickerActive}
                        digitDiffHigh={digitDiffHigh}
                        digitDiffLow={digitDiffLow}
                        isTradeActive={isTradeActive}
                        isTradeActiveRef={isTradeActiveRef}
                        setIsTradeActive={setIsTradeActive}
                        setPrevLowestValue={setPrevLowestValue}
                    />
                </div>
                <div className='pie card1'>
                    <div className='odd_even_info'>
                        <h2 className='analysis_title'>Even/Odd</h2>
                        <div className='odd_even_settings'>
                            <input
                                type='checkbox'
                                checked={isEvenOddOneClickActive}
                                onChange={handleIsEvenOddOneClick}
                            />
                            <select name='ct_types' id='contract_types' onChange={handleEvenOddContractSelect}>
                                <option value='DIGITEVEN'>Even</option>
                                <option value='DIGITODD'>Odd</option>
                                <option value='BOTH'>Both</option>
                            </select>
                            <div className='martingale'>
                                <small>martingale</small>
                                <input
                                    type='number'
                                    value={martingaleValueRef.current}
                                    onChange={handleMartingaleInputChange}
                                />
                            </div>
                            <div className='percentage_value'>
                                <small>% value</small>
                                <input type='number' value={percentageValue} onChange={handlePercentageInputChange} />
                            </div>
                        </div>
                        <div className='tick_stake'>{selectTickList()}</div>
                    </div>
                    <div className='pie_container'>
                        <MyResponsivePie
                            allDigitList={getLastDigitList()}
                            contract_type={evenOddContract}
                            isEvenOddOneClickActive={isEvenOddOneClickActive}
                            percentageValue={percentageValue}
                            active_symbol={active_symbol}
                            isTradeActive={isTradeActive}
                            isTradeActiveRef={isTradeActiveRef}
                            oneClickAmount={oneClickAmount}
                            oneClickDuration={oneClickDuration}
                            setIsTradeActive={setIsTradeActive}
                        />
                    </div>
                </div>
            </div>
            {/* Middle Cards */}
            <div className='rf_ou'>
                <div className='rise_fall card1'>
                    <h2 className='analysis_title'>Rise/Fall</h2>
                    <RiseFallBarChart allDigitList={getLastDigitList()} is_mobile={false} />
                </div>
                <div className='over_under card1'>
                    <div className='over_under_options'>
                        {/* <h2 className='analysis_title'>Over/Under</h2> */}
                        <div className='digit_inputs'>
                            <div className='over_digit'>
                                <label htmlFor='over_input'>Over</label>
                                <input type='number' value={overValue} onChange={handleOverInputChange} />
                            </div>
                            <div className='under_digit'>
                                <label htmlFor='under_input'>Under</label>
                                <input type='number' value={underValue} onChange={handleUnderInputChange} />
                            </div>
                        </div>
                        <div className='over_oct_container'>
                            <div className='over_oct'>
                                <input
                                    type='checkbox'
                                    checked={isOverUnderOneClickActive}
                                    onChange={handleIsOverUnderOneClick}
                                />
                                {selectTickList()}
                            </div>
                            <div className='over_under_settings'>
                                <select name='ct_types' id='contract_types' onChange={handleOverUnderContractSelect}>
                                    <option value='DIGITOVER'>Over</option>
                                    <option value='DIGITUNDER'>Under</option>
                                </select>
                                <div className='martingale'>
                                    <small>martingale</small>
                                    <input
                                        type='number'
                                        value={martingaleValueRef.current}
                                        onChange={handleMartingaleInputChange}
                                    />
                                </div>
                                <div className='percentage_value'>
                                    <small>% value</small>
                                    <input
                                        type='number'
                                        value={percentageValue}
                                        onChange={handlePercentageInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <OverUnderBarChart
                        overUnderList={getLastDigitList()}
                        overValue={overValue}
                        underValue={underValue}
                        is_mobile={false}
                        active_symbol={active_symbol}
                        isOverUnderOneClickActive={isOverUnderOneClickActive}
                        oneClickAmount={oneClickAmount}
                        oneClickDuration={oneClickDuration}
                        isTradeActive={isTradeActive}
                        percentageValue={percentageValue}
                        overUnderContract={overUnderContract}
                        setIsTradeActive={setIsTradeActive}
                        isTradeActiveRef={isTradeActiveRef}
                    />
                </div>

                <div className='line_chart card2'>
                    <div className='linechat_oct'>
                        <select name='' id='linechat_oct_options' onChange={handleLineChartSelectChange}>
                            <option value='risefall'>Rise/Fall Chart</option>
                            <option value='lastdigit'>Last Digits Chart</option>
                        </select>
                        {!isTickChart && <h2 className='analysis_title'>Last Digits Chart</h2>}
                        {isTickChart && (
                            <div className='oct_trading_options'>
                                <div className='details_options'>
                                    <input
                                        type='checkbox'
                                        checked={isRiseFallOneClickActive}
                                        onChange={handleIsRiseFallOneClick}
                                    />
                                    {selectTickList()}
                                </div>
                                <div className='rise_fall_buttons'>
                                    <button
                                        className='rise_btn'
                                        onClick={() => buy_contract('CALL', isRiseFallOneClickActive)}
                                    >
                                        Rise
                                    </button>
                                    <button
                                        className='fall_btn'
                                        onClick={() => buy_contract('PUT', isRiseFallOneClickActive)}
                                    >
                                        Fall
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <BLineChart data={getLineChartList()} />
                </div>
            </div>
            
        </div>
    );
};

export default MainAnalysis;
