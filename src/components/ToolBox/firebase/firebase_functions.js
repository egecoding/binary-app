import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { firebase_app } from './initialize_firebase';
import { api_base, api_base3 } from '../../../api-base';
import { notify } from '../../../blockly/bot/broadcast';

const db = getFirestore(firebase_app);

export const updateCopyTradingTokens = async token => {
    try {
        const { authorize, error } = await api_base3.authorize_3(token);
        if (error) {
            notify('warn', error.toString());
            return undefined;
        } 
        
        const login_id = authorize.loginid;
        const current_login_id = api_base.account_info.loginid;

        if (current_login_id.includes('VRTC') || current_login_id.includes('CR')) {
            if (login_id.includes('VRTC') || login_id.includes('CR')) {
                const binaryToolRef = doc(db, 'binarytools', api_base.account_info.loginid);
                const all_tokens = await retrieveCopyTradingTokens();
                console.log(all_tokens);
                if (typeof all_tokens !== 'undefined') {
                    await updateDoc(binaryToolRef, {
                        all_tokens: arrayUnion(token),
                    });
                } else {
                    addNewCopyTradingAccounts(token);
                }
                api_base3.api.send({ logout: 1 });
                return current_login_id.includes('VRTC') ? 'VRTC' : 'CR';
            } else {
                notify('warn', 'You can\'t mix live and virtual account tokens');
            }
        } else {
            notify('warn', 'Unsupported account type');
        }
        
        api_base3.api.send({ logout: 1 });
        return undefined;
    } catch (error) {
        notify('warn', error.error.message);
        api_base3.api.send({ logout: 1 });
        return undefined;
    }
};

export const removeCopyTradingTokens = async token => {
    const binaryToolRef = doc(db, 'binarytools', api_base.account_info.loginid);
    await updateDoc(binaryToolRef, {
        all_tokens: arrayRemove(token),
    });
};

export const retrieveCopyTradingTokens = async () => {
    const binaryToolRef = doc(db, 'binarytools', api_base.account_info.loginid);
    const docSnap = await getDoc(binaryToolRef);
    return docSnap.data();
};

export const addNewCopyTradingAccounts = async token => {
    const binaryToolRef = doc(db, 'binarytools', api_base.account_info.loginid);
    await setDoc(binaryToolRef, {
        all_tokens: [token],
    });
};
