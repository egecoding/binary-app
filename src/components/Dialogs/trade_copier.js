/* eslint-disable no-nested-ternary */
import React, { useRef } from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';
import { IoTrashBinSharp } from 'react-icons/io5';
import { AiOutlineCloudSync } from 'react-icons/ai';
import './style.css';
import { removeCopyTradingTokens, updateCopyTradingTokens } from '../ToolBox/firebase/firebase_functions';
import {
    newListTokens,
    reCallTheTokens,
    retrieveListItem,
    saveListItemToStorage,
} from '../ToolBox/firebase/localStorageFunctions';
import { VH_Variables } from '../../blockly/blocks/vh_shared';
import { api_base } from '@api-base';
const chartWidth = 400;
const chartHeight = 400;
function TradeCopier() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('CopyTrading Options Loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('.main_toolbox');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);
        retrieveListItem().then(list_item => {
            const login_id = api_base.account_info.loginid;
            if (login_id.includes('VRTC')) {
                setTokenType('Demo Tokens');
            } else if (login_id.includes('CR')) {
                setTokenType('Live Tokens');
            }

            if (list_item !== undefined) {
                const cleanList = Array.isArray(list_item[0]) ? list_item[0] : list_item;
                if (cleanList.length > 0) {
                    setAllTokens(cleanList);
                    setWasTokens(true);
                    listRefs.current.forEach((ref, index) => {
                        const token = cleanList[index];
                        if (ref) {
                            const clickHandler = () => handleDeleteButtonClick(token);
                            ref.addEventListener('click', clickHandler);

                            // Store the clickHandler function to facilitate removal later
                            ref.clickHandler = clickHandler;
                        }
                    });
                } else {
                    setAllTokens(undefined);
                }
            } else {
                setAllTokens(undefined);
            }
        });
        addEventlisteners();
        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
            listRefs.current.forEach(ref => {
                if (ref && ref.clickHandler) {
                    ref.removeEventListener('click', ref.clickHandler);
                }
            });
        };
    }, []);

    const [inputValue, setInputValue] = React.useState('');
    const [allTokens, setAllTokens] = React.useState([]);
    const [addBtnStatus, setAddBtnStatus] = React.useState('Add');
    const [syncing, setSyncing] = React.useState(false);
    const [enableCP, setEnableCP] = React.useState(false);
    const [wasTokens, setWasTokens] = React.useState(false);
    const [tokenType, setTokenType] = React.useState('');
    const listRefs = useRef([]);

    const handleCPChange = () => {
        setEnableCP(!enableCP);
        VH_Variables.isCTActive = !VH_Variables.isCTActive;
        console.log('The VH variables:', VH_Variables.isCTActive);
    };
    const handleSynceData = async () => {
        setSyncing(true);
        const login_id = api_base.account_info.loginid;
        const new_tokens = await reCallTheTokens();
        if (typeof new_tokens !== 'undefined') {
            setAllTokens(new_tokens);
        } else {
            setAllTokens([]);
        }

        if (login_id.includes('VRTC')) {
            setTokenType('Demo Tokens');
        } else if (login_id.includes('CR')) {
            setTokenType('Live Tokens');
        }
        setSyncing(false);
    };

    const handleAddButtonClick = async () => {
        const token_input = document.getElementById('token_input');
        setAddBtnStatus('...');
        const inpt = token_input.value.trim();
        const response = await updateCopyTradingTokens(inpt);
        if (response !== undefined) {
            saveListItemToStorage(inpt);
            if (typeof allTokens === 'undefined') {
                setAllTokens([inpt]);
            } else {
                if (allTokens.length > 0) {
                    setAllTokens(prevTokens => [inpt, ...prevTokens]);
                } else {
                    setAllTokens([inpt]);
                }
                await handleSynceData();
            }
        }
        token_input.value = '';
        setAddBtnStatus('Add');
    };

    const handleDeleteButtonClick = async token => {
        await removeCopyTradingTokens(token);
        const newList = allTokens.filter(item => item !== token);
        setAllTokens(newList);
        newListTokens(newList);
    };
    const addEventlisteners = () => {
        const add_button = document.getElementById('add_tokens');
        const syncing_data = document.getElementById('syncing_data');
        const cp_checkbox = document.getElementById('cp_checkbox');
        add_button.addEventListener('click', () => handleAddButtonClick());
        syncing_data.addEventListener('click', () => handleSynceData());
        cp_checkbox.addEventListener('click', () => handleCPChange());
    };
    return (
        <div className='main_toolbox'>
            <div className='create_token'>
                {/* "Create Token" button with specified name and link */}
                <a href='https://app.deriv.com/account/api-token' target='_blank' rel='noopener noreferrer'>
                    <button>Create Token with Read, Trade, Trading information</button>
                </a>
            </div>
            <div className='add_tokens'>
                <input type='text' id='token_input' />
                <button id='add_tokens'>{addBtnStatus}</button>
            </div>
            <div className='switcher'>
                <div className='on_off_switch'>
                    <h1 style={{ color: 'black', fontSize: '16px' }}>Enable CopyTrading </h1>
                    <input type='checkbox' checked={enableCP} id='cp_checkbox' />
                </div>
            </div>
            <div className='switcher'>
                <div className='on_off_switch'>
                    <h5 style={{ color: 'black' }}>Sync Tokens </h5>
                    <button id='syncing_data' className='sync_btn'>
                        {syncing ? <div>syncing</div> : <AiOutlineCloudSync />}
                    </button>
                </div>
            </div>
            <div className='token_type'>
                <small>{tokenType}</small>
            </div>
            <div className='all_tokens'>
                <ul>
                    {typeof allTokens === 'undefined' ? (
                        <div>No tokens for CopyTrading</div>
                    ) : allTokens.length > 0 ? (
                        allTokens.map((token, index) => (
                            <li key={token} ref={el => (listRefs.current[index] = el)}>
                                {token}
                                <span>
                                    <IoTrashBinSharp />
                                </span>
                            </li>
                        ))
                    ) : wasTokens ? (
                        <div>No tokens Available...</div>
                    ) : (
                        <div>Loading tokens...</div>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default class TradingView extends Dialog {
    constructor() {
        super('trade-copier-dialog', translate('Copy Trading Tokens'), <TradeCopier />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
