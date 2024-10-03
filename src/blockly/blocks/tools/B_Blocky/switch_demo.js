import { translate } from '@i18n';

Blockly.Blocks.switch_demo = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Switch to Virtual Account'));
        this.setOutput(true, 'String');
        this.setColour('#dedede');
        this.setTooltip(translate('Switch Account to VH.'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
};
Blockly.JavaScript.switch_demo = () => {
    const code = 'Bot.vhAccountSwitcher("virtual")';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
