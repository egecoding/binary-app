import { VH_Variables } from '../../vh_shared';

Blockly.Blocks.virtual_hook_token = {
    init: function init() {
        this.appendValueInput('account_token').setCheck('String').appendField('virtual-account token');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('account token for VH');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript.virtual_hook_token = block => {
    const value_account_token = Blockly.JavaScript.valueToCode(block, 'account_token', Blockly.JavaScript.ORDER_ATOMIC);
    console.log('The Token is', value_account_token);
    if (value_account_token !== undefined) {
        VH_Variables.virtual_account_token = value_account_token.trim();
    }

    // TODO: Assemble javascript into code variable.
    const code = '';
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
};
