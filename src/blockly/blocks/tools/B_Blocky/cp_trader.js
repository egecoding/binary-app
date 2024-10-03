import { getBlocksByType } from '../../../utils';
import { VH_Variables } from '../../vh_shared';
let isLoaded = false;
Blockly.Blocks.cp_trader = {
    init: function init() {
        this.appendDummyInput().appendField('Copy Trading');
        this.appendValueInput('copy_tokens').setCheck('Array').appendField('List of Tokens');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript.cp_trader = block => {
    const tokensString = Blockly.JavaScript.valueToCode(block, 'copy_tokens', Blockly.JavaScript.ORDER_ATOMIC);
    const tokensArray = tokensString
        .substring(1, tokensString.length - 1)
        .split("', '")
        .map(token => token.replace(/'/g, ''));
    VH_Variables.isCTActive = true;
    VH_Variables.blocky_cp = true;
    VH_Variables.user_tokens = tokensArray
    const code = '';
    return code;
};
