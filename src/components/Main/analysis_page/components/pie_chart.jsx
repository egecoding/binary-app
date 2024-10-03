import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { api_base } from '../../../../api-base';

const MyResponsivePie = ({
    allDigitList,
    contract_type,
    isEvenOddOneClickActive,
    percentageValue,
    active_symbol,
    isTradeActiveRef,
    oneClickAmount,
    oneClickDuration,
    isTradeActive,
    setIsTradeActive,
}) => {
    const buy_contract = (contract_type) => {
        if (isEvenOddOneClickActive && !isTradeActive) {
            isTradeActiveRef.current = true;
            setIsTradeActive(true);
            api_base.api.send({
                buy: '1',
                price: oneClickAmount,
                subscribe: 1,
                parameters: {
                    amount: oneClickAmount,
                    basis: 'stake',
                    contract_type: contract_type,
                    currency: 'USD',
                    duration: oneClickDuration,
                    duration_unit: 't',
                    symbol: active_symbol,
                },
            });
        }
    };

    const calculateOddEvenPercentages = (numbers) => {
        let oddCount = 0;
        let evenCount = 0;
        const totalNumbers = numbers.length;

        numbers.forEach((number) => {
            if (number % 2 === 0) {
                evenCount++;
            } else {
                oddCount++;
            }
        });

        return {
            oddPercentage: ((oddCount / totalNumbers) * 100).toFixed(2),
            evenPercentage: ((evenCount / totalNumbers) * 100).toFixed(2),
        };
    };

    const percentages = calculateOddEvenPercentages(allDigitList);

    if (typeof percentageValue === 'number') {
        if (contract_type === 'DIGITEVEN' && percentages.oddPercentage >= percentageValue) {
            buy_contract('DIGITEVEN');
        } else if (contract_type === 'DIGITODD' && percentages.evenPercentage >= percentageValue) {
            buy_contract('DIGITODD');
        } else if (contract_type === 'BOTH') {
            if (percentages.evenPercentage >= percentageValue) {
                buy_contract('DIGITODD');
            }
            if (percentages.oddPercentage >= percentageValue) {
                buy_contract('DIGITEVEN');
            }
        }
    }

    const pie_data = [
        {
            id: 'Even',
            label: '',
            value: percentages.evenPercentage,
            color: 'hsl(245, 70%, 50%)',
        },
        {
            id: 'Odd',
            label: '',
            value: percentages.oddPercentage,
            color: 'hsl(11, 70%, 50%)',
        },
    ];

    return (
        <ResponsivePie
            data={pie_data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            fill={[
                {
                    match: {
                        id: 'Even',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'Odd',
                    },
                    id: 'lines',
                },
            ]}
            legends={[]}
        />
    );
};

export default MyResponsivePie;
