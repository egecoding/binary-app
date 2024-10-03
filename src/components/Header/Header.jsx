import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api_base } from '@api-base';
import { removeAllTokens, getActiveLoginId, getClientAccounts } from '@storage';
import * as client_slice from '@redux-store/client-slice';
import { setAccountSwitcherLoader, updateShowMessagePage,updateActiveTab } from '@redux-store/ui-slice';
import { observer as globalObserver } from '@utilities/observer';
import DrawerMenu from './drawer-menu';
import AuthButtons from './auth-buttons';
import AccountActions from './account-actions';
import Loader from './loader';
import { checkSwitcherType, isEuByAccount } from '../../common/footer-checks';
import './header.scss';
import './custom.css';

const AccountSwitcher = () => {
    const { account_switcher_loader } = useSelector(state => state.ui);
    const { is_logged } = useSelector(state => state.client);

    // if (account_switcher_loader) {
    //     return (
    //         <div className='header__menu-right-loader'>
    //             <Loader />
    //         </div>
    //     );
    // }
    if (is_logged) return <AccountActions />;
    return <div></div>;
};

const Header = () => {
    const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = React.useState(false);
    const [showDrawerMenu, updateShowDrawerMenu] = React.useState(false);
    const platformDropdownRef = React.useRef();
    const { is_logged, login_id } = useSelector(state => state.client);
    const { is_bot_running,active_tab } = useSelector(state => state.ui);
    const dispatch = useDispatch();
    const hideDropdown = e => !platformDropdownRef?.current?.contains(e.target) && setIsPlatformSwitcherOpen(false);

    // Login check or account check should not happen here
    // it should happen in the main component which main.jsx
    // We need to move every check related to login or active account to main.jsx
    React.useEffect(() => {
        const active_account = { ...api_base.account_info };
        const { landing_company_name } = active_account;
        if (landing_company_name === 'maltainvest') {
            dispatch(updateShowMessagePage(true));
        }

        globalObserver.setState({
            is_eu_country: isEuByAccount(active_account),
        });

        if (!active_account) {
            removeAllTokens();
            dispatch(client_slice.resetClient());
            dispatch(setAccountSwitcherLoader(false));
        }

        const client_accounts = getClientAccounts();
        const current_login_id = getActiveLoginId();
        const logged_in_token = client_accounts[current_login_id]?.token || active_account?.token || '';

        if (logged_in_token) {
            dispatch(setAccountSwitcherLoader(false));
        }
    }, [login_id]);

    React.useEffect(() => {
        api_base.api.expectResponse('balance').then(({ balance }) => {
            dispatch(client_slice.updateBalance(balance));
            globalObserver.setState({
                balance: Number(balance.balance),
                currency: balance.currency,
            });
        });

        api_base.api.onMessage().subscribe(({ data }) => {
            if (data.msg_type === 'balance') {
                dispatch(client_slice.updateBalance(data.balance));
                globalObserver.setState({
                    balance: Number(data.balance.balance),
                    currency: data.balance.currency,
                });
            }
        });

        const mountSwitcher = () => {
            const res = checkSwitcherType();
            if (res) {
                dispatch(client_slice.updateAccountType(res));
                const current_login_id = getActiveLoginId();
                if (current_login_id?.startsWith('MF')) {
                    dispatch(updateShowMessagePage(true));
                }
            }
        };
        mountSwitcher();
    }, []);

    React.useEffect(() => {
        window.addEventListener('beforeunload', onBeforeUnload, { capture: true });
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload, { capture: true });
        };
    }, [is_bot_running]);

    const onBeforeUnload = e => {
        if (is_bot_running) {
            e.preventDefault();
            e.returnValue = true;
        }
    };

    return (
        <div className='header'>
            <div id='deriv__header' className='header__menu-items'>
                <div className='custom-logo'>
                    <img src='/public/images/logo.png' width='40px' height='40px' alt />
                    <img src='/public/images/banner-deriv-white.png' width='150px' height='18px' alt className='powerd_deriv'/>
                </div>

                <div className='tab_switcher'>
                    <div
                        className={`blocky_page ${active_tab === 0 && 'active'}`}
                        onClick={() => dispatch(updateActiveTab(0))}
                    >
                        Blocky
                    </div>
                    <div
                        className={`ai_robot_page ${active_tab === 1 && 'active'}`}
                        onClick={() => dispatch(updateActiveTab(1))}
                    >
                        AI Robot
                    </div>
                    <div
                        className={`ai_robot_page ${active_tab === 2 && 'active'}`}
                        onClick={() => dispatch(updateActiveTab(2))}
                    >
                        Manual
                    </div>
                </div>

                <div className='header__menu-right'>
                    <AccountSwitcher />
                </div>
            </div>
            {showDrawerMenu && (
                <DrawerMenu
                    updateShowDrawerMenu={updateShowDrawerMenu}
                    setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                    isPlatformSwitcherOpen={isPlatformSwitcherOpen}
                    hideDropdown={hideDropdown}
                    platformDropdownRef={platformDropdownRef}
                    is_logged={is_logged}
                />
            )}
        </div>
    );
};

export default Header;
