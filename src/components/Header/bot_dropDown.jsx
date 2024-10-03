import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@i18n';
import BotsTabContent from './bot_tab_content.jsx';
import { automatedBots, normalBots } from './bots_store.js';

const BotsDropdown = React.forwardRef((props, dropdownRef) => {
    const { setIsAccDropdownOpen } = props;
    const [activeTab, setActiveTab] = React.useState('real');

    const container_ref = React.useRef();

    const is_demo = activeTab === 'demo';
    const is_real = activeTab === 'real';

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (container_ref.current && !container_ref?.current?.contains(event.target)) {
                setIsAccDropdownOpen(false);
            }
        }
        window.addEventListener('click', handleClickOutside);
        eventListenerHandler()
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const eventListenerHandler = ()=>{
        const automated_bots = document.getElementById('at_bots');
        const normal_bots = document.getElementById('nm_bots');

        automated_bots.addEventListener('click',()=>setActiveTab('real'));
        normal_bots.addEventListener('click',()=>setActiveTab('demo'));
    }

    const shouldShowRealAcc = ({ acc = automatedBots['digit_differs'], title,isMain}) => (
        <BotsTabContent tab='real' isActive={is_real} setIsAccDropdownOpen={setIsAccDropdownOpen} accounts={acc} title={title} isMain={isMain}/>
    );

    return (
        <div className='account__switcher-dropdown-wrapper show' ref={dropdownRef}>
            <div id='account__switcher-dropdown' className='account__switcher-dropdown' ref={container_ref}>
                <div className='account__switcher-container'>
                    <ul className='account__switcher-tabs'>
                        <li
                            className={`account__switcher-tab ${is_real ? 'ui-tabs-active' : ''}`}
                            id='at_bots'
                            // onClick={() => setActiveTab('real')}
                        >
                            <a>{translate('Automated Bots')}</a>
                        </li>
                        <li
                            className={`account__switcher-tab ${is_real ? '' : 'ui-tabs-active'}`}
                            id='nm_bots'
                            // onClick={() => setActiveTab('demo')}
                        >
                            <a>{translate('Normal Bots')}</a>
                        </li>
                    </ul>
                    {/* should show Normal Bots */}
                    {shouldShowRealAcc({ title: 'DigitDiffers', acc: automatedBots['digit_differs'], isMain: true })}
                    {shouldShowRealAcc({ title: 'Over/Under', acc: automatedBots['over_under'], isMain: false  })}
                    {shouldShowRealAcc({ title: 'Rise/Fall', acc: automatedBots['rise_fall'], isMain: false  })}
                    <BotsTabContent
                        tab='demo'
                        isActive={is_demo}
                        setIsAccDropdownOpen={setIsAccDropdownOpen}
                        accounts={normalBots}
                        isMain={true}
                        title={"BinaryTools Bots"}
                    />
                </div>
            </div>
        </div>
    );
});

BotsDropdown.displayName = 'BotsDropdown';

BotsDropdown.propTypes = {
    setIsAccDropdownOpen: PropTypes.func,
};

export default BotsDropdown;
