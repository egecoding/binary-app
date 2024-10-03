import React from 'react';
import './custom.css';
import { FaChevronDown } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveLoginId, getClientCountry } from '@storage';
import { setAccountSwitcherId } from '@redux-store/ui-slice';
import * as client_slice from '@redux-store/client-slice.js';
import Modal from '@components/common/modal';
import { translate } from '@i18n';
import useLogout from '../../common/hooks/useLogout';
import { useLocation } from 'react-router-dom';
import { setShouldReloadWorkspace } from '@redux-store/ui-slice.js';
import AccountSwitchModal from './account-switch-modal';
import { observer as globalObserver } from '@utilities/observer';
const NewDropAcc = ({ setisSwitching }) => {
    const dispatch = useDispatch();
    const item_ref = React.useRef([]);
    const [toggleDropDown, setToggleDropDown] = React.useState(false);
    const { currency, is_virtual, balance, login_id, accounts } = useSelector(state => state.client);
    const [show_logout_modal, updaetShowLogoutModal] = React.useState(false);
    const { is_bot_running, account_switcher_id, show_bot_unavailable_page } = useSelector(state => state.ui);
    const currency_icon = is_virtual ? 'virtual' : currency.toLowerCase() || 'unknown';
    const virtual_accounts = [];
    const eu_accounts = [];
    const non_eu_accounts = [];
    Object.keys(accounts).forEach(account => {
        if (account.startsWith('VR')) virtual_accounts.push({ ...accounts[account], account });
        if (account.startsWith('MF')) eu_accounts.push({ ...accounts[account], account });
        if (account.startsWith('CR')) non_eu_accounts.push({ ...accounts[account], account });
    });
    const real_account = [...non_eu_accounts, ...eu_accounts];
    const all_accounts = [...real_account, ...virtual_accounts];

    const acc_container_ref = React.useRef();

    React.useEffect(() => {
        function handleModalClickOutside(event) {
            if (acc_container_ref.current && !acc_container_ref.current.contains(event.target)) {
                setisSwitching(false);
            }
        }
        window.addEventListener('click', handleModalClickOutside);

        return () => window.removeEventListener('click', handleModalClickOutside);
    }, []);

    const accountList = all_accounts.map((item, index) => (
        <li
            key={index}
            className='option'
            ref={el => (item_ref.current[index] = el)}
            onClick={() => onChangeAccount(item.account)}
        >
            <img
                id='header__acc-icon'
                className='header__acc-icon'
                src={`/public/images/currency/ic-currency-${
                    item.demo_account ? 'virtual' : item.currency.toLowerCase()
                }.svg`}
            ></img>
            <span className='option-text'>{item.account}</span>
        </li>
    ));

    const onChangeAccount = id => {
        setisSwitching(true);
        dispatch(setAccountSwitcherId(id));
        setToggleDropDown(!toggleDropDown);
    };

    const formatNumber = numberValue => {
        // Convert the string to a number
        let number = parseFloat(numberValue);

        // Check if the conversion was successful
        if (!isNaN(number)) {
            // Format the number with commas and two decimal places
            return number.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        } else {
            // If conversion fails, return the original string
            return numberString;
        }
    };

    const logout = useLogout();
    const location = useLocation();

    const onLogout = () => {
        if (location.pathname.includes('endpoint')) {
            logout();
            setisSwitching(false);
        } else {
            globalObserver.emit('ui.logout');
            setisSwitching(false);
        }
        dispatch(setShouldReloadWorkspace(true));
    };

    return (
        <div className={`select-menu ${toggleDropDown && 'active'}`} onClick={() => setToggleDropDown(!toggleDropDown)}>
            <div className='select-btn'>
                <div className='active_account_info'>
                    <span className='sBtn-text0'>{login_id}</span>
                    <span className='sBtn-text'>
                        {formatNumber(balance)} {currency}
                    </span>
                </div>
                <FaChevronDown />
            </div>
            <div className='options' ref={acc_container_ref}>
                <ul>{accountList}</ul>
                <div
                    id='deriv__logout-btn'
                    className='account__switcher-logout logout'
                    onClick={() => {
                        if (show_bot_unavailable_page) onLogout();
                        else updaetShowLogoutModal(true);
                    }}
                >
                    <span className='account__switcher-logout-text'>{translate('Log out')}</span>
                    <img className='account__switcher-logout-icon logout-icon' src='/public/images/ic-logout.svg' />
                </div>
            </div>

            {show_logout_modal && (
                <Modal
                    title={translate('Are you sure?')}
                    class_name='logout'
                    onClose={() => updaetShowLogoutModal(false)}
                >
                    <AccountSwitchModal
                        is_bot_running={is_bot_running}
                        onClose={() => updaetShowLogoutModal(false)}
                        onAccept={onLogout}
                    />
                </Modal>
            )}
        </div>
    );
};

export default NewDropAcc;
