import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrackJS } from 'trackjs';
import { getRelatedDeriveOrigin, queryToObjectArray } from '@utils';
import { translate } from '@i18n';
import { getClientAccounts, isDone, getLanguage, getTourState, getActiveLoginId } from '@storage';
import SidebarToggle from '@components/common/SidebarToggle';
import ToolBox from '@components/ToolBox';
import useQuery from '@components/hooks/useQuery';
import { updateActiveAccount, updateIsLogged, setLoginId } from '@redux-store/client-slice';
import { setAccountSwitcherLoader, setShouldReloadWorkspace, updateShowTour } from '@redux-store/ui-slice';
import { observer as globalObserver } from '@utilities/observer';
import logHandler from '@utilities/logger';
import { loginAndSetTokens } from '../../common/appId';
import Blockly from '../../blockly';
import LogTable from '../../botPage/view/LogTable';
import TradeInfoPanel from '../../botPage/view/TradeInfoPanel';
import initialize, { applyToolboxPermissions } from '../../blockly/blockly-worksace';
import BotUnavailableMessage from '../Error/bot-unavailable-message-page';
import { VH_Variables } from '../../blockly/blocks/vh_shared';
import LoginPopDialog from './components/login_pop';
import './components/style.css';
import MainAnalysis from './analysis_page/analysis';

const Main = () => {
    const [blockly, setBlockly] = useState(null);
    const [is_workspace_rendered, setIsWorkspaceRendered] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { should_reload_workspace, active_tab } = useSelector(state => state.ui);
    const query_object = useQuery();
    const token_list = getClientAccounts();

    React.useEffect(() => {
        logHandler();
    }, []);

    useEffect(() => {
        window.addEventListener('storage', event => {
            if (event.key === 'active_loginid' && event.newValue !== event.oldValue) {
                window.location.reload();
            }
        });

        const currentUrl = window.location.href;
        if (active_tab !== 0) return;
        if (currentUrl.includes('VRTC')) {
            loginCheck().then(() => {
                const new_blockly = new Blockly();
                VH_Variables.global_blocky = new_blockly;
                setBlockly(new_blockly);
                init();
                initializeBlockly(new_blockly).then(() => setIsWorkspaceRendered(new_blockly?.is_workspace_rendered));
                dispatch(setShouldReloadWorkspace(false));
            });
        } else if (Object.keys(token_list).length > 0) {
            const new_blockly = new Blockly();
            VH_Variables.global_blocky = new_blockly;
            setBlockly(new_blockly);
            init();
            loginCheck()
                .then(() => initializeBlockly(new_blockly))
                .then(() => setIsWorkspaceRendered(new_blockly?.is_workspace_rendered));
            dispatch(setShouldReloadWorkspace(false));
        } else {
            $('.barspinner').hide();
        }
    }, [active_tab]);

    useEffect(() => {
        if (should_reload_workspace && blockly) {
            globalObserver.emit('bot.reload');
            dispatch(setShouldReloadWorkspace(false));
            applyToolboxPermissions();
        }
    }, [should_reload_workspace, blockly]);

    const init = () => {
        const local_storage_sync = document.getElementById('localstorage-sync');
        if (local_storage_sync) {
            local_storage_sync.src = `${getRelatedDeriveOrigin().origin}/localstorage-sync.html`;
        }
    };

    const loginCheck = async () => {
        const tokenList = queryToObjectArray(query_object) || [];

        if (tokenList.length && tokenList[0].token) {
            navigate('/', { replace: true });
        } else {
            const client_accounts = getClientAccounts();
            Object.keys(client_accounts).forEach(accountName => {
                tokenList.push({
                    accountName,
                    cur: client_accounts[accountName].currency,
                    token: client_accounts[accountName].token,
                });
            });
        }

        try {
            const { account_info = {} } = await loginAndSetTokens(tokenList);

            if (account_info?.loginid) {
                dispatch(setLoginId(account_info?.loginid));
                dispatch(updateIsLogged(true));
                dispatch(updateActiveAccount(account_info));
                applyToolboxPermissions();
            } else {
                dispatch(updateIsLogged(false));
            }
        } catch (error) {
            console.error('Login check error:', error);
            dispatch(updateIsLogged(false));
        } finally {
            dispatch(setAccountSwitcherLoader(false));
        }
    };

    const initializeBlockly = _blockly =>
        initialize(_blockly).then(() => {
            $('.show-on-load').show();
            $('.barspinner').hide();
            window.dispatchEvent(new Event('resize'));
            const userId = getActiveLoginId();
            if (userId) {
                TrackJS.configure({ userId });
            }
            return _blockly.initPromise;
        });

    return (
        <div>
            <a
                className='fixed-banner__visit-deriv-bot'
                href='https://app.binarytool.site/bot'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: 'red',
                    textDecoration: 'none',
                    color: 'white',
                }}
            >
                <div className='fixed-banner__icon-info icon-info' style={{ fontWeight: '500' }}>
                    Super speed Dbot Platform
                </div>
            </a>

            {Object.keys(token_list).length > 0 ? (
                <>
                    {active_tab == 0 ? (
                        <div className='main'>
                            <Helmet
                                htmlAttributes={{
                                    lang: getLanguage(),
                                }}
                                title={translate('Binarytool | Automated trading system – Deriv')}
                                defer={false}
                                meta={[
                                    {
                                        name: 'description',
                                        content: translate(
                                            'Automate your trades with Deriv’s bot trading platform, no coding needed. Trade now on forex, synthetic indices, commodities, stock indices, and more.'
                                        ),
                                    },
                                ]}
                            />
                            <BotUnavailableMessage />
                            <div id='bot-blockly' className={active_tab === 0 ? 'active_tab' : 'inactive_tab'}>
                                {blockly && <ToolBox blockly={blockly} is_workspace_rendered={is_workspace_rendered} />}
                                <div id='blocklyArea'>
                                    <div id='blocklyDiv' style={{ position: 'absolute' }}></div>
                                    <SidebarToggle />
                                </div>
                                {blockly && <LogTable />}
                                {blockly && <TradeInfoPanel />}
                            </div>
                        </div>
                    ) : active_tab == 1 ?(
                        <div className={active_tab !== 0 ? 'active_tab' : 'inactive_tab'}>
                            <div class='iframe-container'>
                                <iframe src='https://www.binaryairobot.site/' frameborder='0' allowfullscreen></iframe>
                            </div>
                        </div>
                    ): <MainAnalysis />}
                </>
            ) : (
                <LoginPopDialog />
            )}
        </div>
    );
};

export default Main;