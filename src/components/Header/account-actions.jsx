import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes } from 'prop-types';
import { api_base } from '@api-base';
import config from '@config';
import { setActiveLoginId, getClientAccounts, syncWithDerivApp } from '@storage';
import { translate } from '@i18n';
import Modal from '@components/common/modal';
import Tour, { TourTargets } from '@components/common/tour';
import {
    setAccountSwitcherLoader,
    setAccountSwitcherId,
    setIsHeaderLoaded,
    setShouldReloadWorkspace,
} from '@redux-store/ui-slice.js';
import * as client_slice from '@redux-store/client-slice.js';
import { observer as globalObserver } from '@utilities/observer';
import AccountDropdown from './account-dropdown.jsx';
import AccountSwitchModal from './account-switch-modal.jsx';
import { addTokenIfValid } from '../../common/appId.js';
import { VH_Variables } from '../../blockly/blocks/vh_shared.js';
import { IoIosArrowDropdown } from 'react-icons/io';
import './custom.css';
import BotsDropdown from './bot_dropDown.jsx';
import NewDropAcc from './new_acc_drop.jsx';

const AccountMenu = ({ is_open }) => {
    const { currency, is_virtual, balance, login_id } = useSelector(state => state.client);
    const { is_bot_running } = useSelector(state => state.ui);
    const { currency_name_map } = config;
    const account_icon = is_bot_running ? 'ic-lock' : 'ic-chevron-down-bold';
    const currency_icon = is_virtual ? 'virtual' : currency.toLowerCase() || 'unknown';

    return (
        <div className={classNames('header__acc-info', { disabled: is_bot_running })}>
            <img
                id='header__acc-icon'
                className='header__acc-icon'
                src={`/public/images/currency/ic-currency-${currency_icon}.svg`}
            />
            <div id='header__acc-balance' className='header__acc-balance'>
                {currency
                    ? balance.toLocaleString(undefined, {
                          minimumFractionDigits: currency_name_map[currency]?.fractional_digits ?? 2,
                      })
                    : ''}
                <span className='symbols'>&nbsp;{currency || translate('No currency assigned')}</span>
                {login_id.includes('MF') && !is_virtual && (
                    <div className='is_symbol_multiplier'>{translate('Multipliers')}</div>
                )}
            </div>
            <img
                className={`header__icon header__expand ${is_open ? 'open' : ''}`}
                src={`/public/images/${account_icon}.svg`}
            />
        </div>
    );
};

AccountMenu.propTypes = {
    is_open: PropTypes.bool,
};

const AccountActions = () => {
    const { is_virtual } = useSelector(state => state.client);
    const { deposit } = config;
    const { visible, label, url } = deposit;
    const { account_switcher_id, is_bot_running } = useSelector(state => state.ui);
    const [is_acc_dropdown_open, setIsAccDropdownOpen] = React.useState(false);
    const [is_bots_dropdown_open, setIsBotsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef();
    const dispatch = useDispatch();
    const [show_popover, setShowPopover] = React.useState(false);
    const [isSwitching, setisSwitching] = React.useState(false);

    useEffect(() => {
        dispatch(setIsHeaderLoaded(true));
    }, []);

    const onAccept = () => {
        globalObserver.emit('ui.switch_account', account_switcher_id);
        dispatch(setAccountSwitcherId(account_switcher_id));
        dispatch(setAccountSwitcherLoader(true));
        $('.barspinner').show();

        const client_accounts = getClientAccounts();
        const next_account = client_accounts[account_switcher_id] || {};
        // keeping track of current active token
        VH_Variables.active_account_token = next_account?.token;
        console.log('Am Done Ninjaaaaa!!!!!!!', account_switcher_id);

        if (next_account?.token) {
            addTokenIfValid(next_account.token).then(account => {
                dispatch(client_slice.updateActiveAccount(api_base.account_info));
                setActiveLoginId(account_switcher_id);
                dispatch(client_slice.setLoginId(account_switcher_id));
                dispatch(setShouldReloadWorkspace(true));
                $('.barspinner').hide();
                syncWithDerivApp();
                dispatch(setAccountSwitcherId(''));
                setisSwitching(false);
            });
        }
    };

    const onClose = () => {
        dispatch(setAccountSwitcherId(''));
        setisSwitching(false);
    };

    return (
        <React.Fragment>
            <NewDropAcc setisSwitching={setisSwitching} />
            {/* <div className='header__divider mobile-hide'></div>

            <div
                id='acc_switcher'
                onMouseEnter={() => is_bot_running && setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
            >
                <span
                    className={classNames('header__menu-item header__menu-acc', { disabled: is_bot_running })}
                    onClick={() => !is_bot_running && setIsAccDropdownOpen(!is_acc_dropdown_open)}
                >
                    <AccountMenu is_open={is_acc_dropdown_open} />
                </span>
                {is_bot_running && show_popover && (
                    <span className='header__menu-acc__popover'>
                        {translate(
                            'Account switching is disabled while your bot is running. Please stop your bot before switching accounts.'
                        )}
                    </span>
                )}
            </div>

            {is_acc_dropdown_open && (
                <AccountDropdown virtual={is_virtual} ref={dropdownRef} setIsAccDropdownOpen={setIsAccDropdownOpen} />
            )} */}

            {isSwitching && (
                <Modal title={translate('Are you sure?')} class_name='account-switcher' onClose={onClose}>
                    <AccountSwitchModal is_bot_running={is_bot_running} onClose={onClose} onAccept={onAccept} />
                </Modal>
            )}
            <TourTargets />
            <Tour />
        </React.Fragment>
    );
};

export default AccountActions;
