import React from 'react';
import { api_base } from '../../../../api-base';

const DiffersBalls = ({
    lastDigitList,
    active_last,
    contract_type,
    duration,
    isOneClickActive,
    active_symbol,
    stake_amount,
    isAutoClickerActive,
    digitDiffHigh,
    digitDiffLow,
    isTradeActive,
    isTradeActiveRef,
    setIsTradeActive
}) => {
    const buy_contract = (prediction) => {
        if (isOneClickActive) {
            api_base.api.send({
                buy: '1',
                price: stake_amount,
                subscribe: 1,
                parameters: {
                    amount: stake_amount,
                    basis: 'stake',
                    contract_type,
                    currency: 'USD',
                    duration,
                    duration_unit: 't',
                    symbol: active_symbol,
                    barrier: prediction,
                },
            });
        }
    };

    const buy_contract2 = (prediction) => {
        if (isOneClickActive && isAutoClickerActive && !isTradeActive) {
            isTradeActiveRef.current = true;
            setIsTradeActive(true);
            api_base.api.send({
                buy: '1',
                price: stake_amount,
                subscribe: 1,
                parameters: {
                    amount: stake_amount,
                    basis: 'stake',
                    contract_type,
                    currency: 'USD',
                    duration,
                    duration_unit: 't',
                    symbol: active_symbol,
                    barrier: prediction,
                },
            });
        }
    };

    const calculatePercentageAppearance = (numbers) => {
        let counts = {};

        numbers.forEach(number => {
            counts[number] = (counts[number] || 0) + 1;
        });

        let totalNumbers = numbers.length;
        let percentages = {};

        for (let number in counts) {
            percentages[number] = (counts[number] / totalNumbers) * 100;
        }

        for (let i = 0; i <= 9; i++) {
            let numStr = i.toString();
            percentages[numStr] = percentages[numStr] || 0;
        }

        if (typeof document !== 'undefined') {
            highlightActiveBall(active_last);
            findMinMaxKeys(percentages);
        }

        return percentages;
    };

    const highlightActiveBall = (number) => {
        const progressBalls = document.querySelectorAll('.progress');

        progressBalls.forEach(ball => {
            ball.classList.remove('active');
            if (parseInt(ball.dataset.number) === number) {
                ball.classList.add('active');
            }
        });
    };

    const findMinMaxKeys = (input) => {
        let maxKey = '';
        let minKey = '';
        let maxValue = -Infinity;
        let minValue = Infinity;
        const progressBalls = document.querySelectorAll('.progress');

        for (const [key, value] of Object.entries(input)) {
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
            if (value < minValue && value > 0) {
                minValue = value;
                minKey = key;
            }
        }

        const calculateAppearance = () => {
            if (active_last === digitDiffLow.current.value) {
                digitDiffLow.current.appearence++;
            } else {
                digitDiffLow.current.value = parseFloat(minKey);
                digitDiffLow.current.appearence = 0;
            }

            if (active_last === digitDiffHigh.current.value) {
                digitDiffHigh.current.appearence++;
            } else {
                digitDiffHigh.current.value = parseFloat(maxKey);
                digitDiffHigh.current.appearence = 0;
            }

            if(digitDiffLow.current.appearence === 2){
                buy_contract2(digitDiffLow.current.value.toString());
                digitDiffLow.current.appearence = 0;
                digitDiffHigh.current.appearence = 0;
            }else if(digitDiffHigh.current.appearence === 2){
                buy_contract2(digitDiffHigh.current.value.toString()); 
                digitDiffHigh.current.appearence = 0;
                digitDiffLow.current.appearence = 0;
            }
        };

        calculateAppearance();

        progressBalls.forEach(ball => {
            ball.classList.remove('top');
            ball.classList.remove('less');
            if (parseInt(ball.dataset.number) === parseFloat(minKey)) {
                ball.classList.add('less');
            }

            if (parseInt(ball.dataset.number) === parseFloat(maxKey)) {
                ball.classList.add('top');
            }
        });

        return { maxKey, minKey };
    };

    let percentages = calculatePercentageAppearance(lastDigitList);

    return (
        <div>
            <div className='differs_container'>
                <div className='progress top' data-number='0' onClick={() => buy_contract('0')}>
                    <small>0</small>
                    <h4>
                        {percentages['0'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='1' onClick={() => buy_contract('1')}>
                    <small>1</small>
                    <h4>
                        {percentages['1'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='2' onClick={() => buy_contract('2')}>
                    <small>2</small>
                    <h4>
                        {percentages['2'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='3' onClick={() => buy_contract('3')}>
                    <small>3</small>
                    <h4>
                        {percentages['3'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress less' data-number='4' onClick={() => buy_contract('4')}>
                    <small>4</small>
                    <h4>
                        {percentages['4'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='5' onClick={() => buy_contract('5')}>
                    <small>5</small>
                    <h4>
                        {percentages['5'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='6' onClick={() => buy_contract('6')}>
                    <small>6</small>
                    <h4>
                        {percentages['6'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='7' onClick={() => buy_contract('7')}>
                    <small>7</small>
                    <h4>
                        {percentages['7'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='8' onClick={() => buy_contract('8')}>
                    <small>8</small>
                    <h4>
                        {percentages['8'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='9' onClick={() => buy_contract('9')}>
                    <small>9</small>
                    <h4>
                        {percentages['9'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default DiffersBalls;
