import { retrieveCopyTradingTokens } from './firebase_functions';
import { api_base } from '../../../api-base';

export const saveListItemToStorage = token => {
    const account_id = api_base.account_info.loginid;
    let items = localStorage.getItem(`${account_id}_tokens`);
    if (items) {
        items = JSON.parse(items);
        items.push(token);
        items = JSON.stringify(items);
        localStorage.setItem(`${account_id}_tokens`, items);
    } else {
        items = [token];
        items = JSON.stringify(items);
        localStorage.setItem(`${account_id}_tokens`, items);
    }
};

export const retrieveListItem = async () => {
    const account_id = api_base.account_info.loginid;
    console.log(`${account_id}_tokens`);
    let item = localStorage.getItem(`${account_id}_tokens`);
    if (item) {
        item = JSON.parse(item);
        if (item.length > 0) {
            return item;
        } 
        item = await retrieveCopyTradingTokens();
        if (typeof item !== 'undefined') {
            saveListItemToStorage(item.all_tokens);
        } else {
            return undefined;
        }
        
    } else {
        item = await retrieveCopyTradingTokens();
        if (typeof item !== 'undefined') {
            saveListItemToStorage(item.all_tokens);
        } else {
            return undefined;
        }
    }
    return item.all_tokens;
};

export const newListTokens = token_list => {
    const account_id = api_base.account_info.loginid;
    const items = JSON.stringify(token_list);
    localStorage.setItem(`${account_id}_tokens`, items);
};

export const reCallTheTokens = async () => {
    const account_id = api_base.account_info.loginid;
    const all_tokens = await retrieveCopyTradingTokens();
    if (typeof all_tokens !== 'undefined') {
        if (localStorage.getItem(`${account_id}_tokens`)) {
            localStorage.removeItem(`${account_id}_tokens`);
        }
        newListTokens(all_tokens.all_tokens);
        return all_tokens.all_tokens;
    }

    return undefined;
};
