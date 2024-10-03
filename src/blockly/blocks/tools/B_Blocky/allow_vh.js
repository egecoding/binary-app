import { api_base2 } from '@api-base';
import { VH_Variables } from '../../vh_shared';
import { notify } from '../../../bot/broadcast';

Blockly.Blocks.allow_vh = {
    init: function init() {
        this.appendDummyInput()
            .appendField('enable virtual hook')
            .appendField(
                new Blockly.FieldDropdown([
                    ['true', 'true'],
                    ['false', 'false'],
                ]),
                'choices'
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('Allow virtual hook to be used in yor bot');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript.allow_vh = block => {
    const enable_choice = block.getFieldValue('choices');
    const code = 'Bot.notify({ className: "warn", message: "Bot started", sound: "silent"});';

    if (enable_choice === 'true') {
        VH_Variables.allow_VH = true;
        notify('success', 'Virtual Hook Enabled', 'job-done');
        authorizeAccount(cleanToken(VH_Variables.virtual_account_token));
    } else {
        VH_Variables.allow_VH = false;
        notify('warn', 'Virtual Hook Disabled', 'job-done');
    }
    // TODO: Assemble javascript into code variable.
    return code;
};

// Custom Functions
export const authorizeAccount = async token => {
    try {
        if (!VH_Variables.is_authorized) {
            const response = await api_base2.authorize_2(token);

            if (response.authorize) {
                VH_Variables.is_authorized = true;
                notify('success', 'Virtual Hook Authorized', 'job-done');
            } else {
                console.error('Authorization failed:', response.error);
            }
        } else {
            notify('success', 'Virtual Hook Already Authorized', 'job-done');
        }
    } catch (error) {
        console.error('An error occurred during authorization:', error);
        notify('error', error.error.message.toString(), 'job-done');
    }
};

export const cleanToken = inputToken => {
    // Remove leading and trailing single quotes
    const cleanedToken = inputToken.replace(/^'|'$/g, '');

    return cleanedToken;
};
