import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';
import BotsDropdown from '../Header/bot_dropDown';
import './style.css';
const chartWidth = 434.381;
const chartHeight = 519.584;

function CustomBotComponent() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('custom bots loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('iframe');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };
    }, []);

    const dropdownRef = React.useRef();
    const [is_bots_dropdown_open, setIsBotsDropdownOpen] = React.useState(false);
    return (
        <BotsDropdown ref={dropdownRef} setIsAccDropdownOpen={setIsBotsDropdownOpen} />
    );
}

export default class TradingView extends Dialog {
    constructor() {
        super('custom-bots-dialog', translate("BinaryTool Presaved Bots"), <CustomBotComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
