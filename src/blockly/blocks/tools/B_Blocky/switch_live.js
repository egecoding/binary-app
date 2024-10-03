import { translate } from '@i18n';

Blockly.Blocks.switch_live = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Switch to Live Account'));
        this.setOutput(true, 'String');
        this.setColour('#dedede');
        this.setTooltip(translate('Switch to Live Account.'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
};
Blockly.JavaScript.switch_live = () => {
    const code = 'Bot.vhAccountSwitcher("main")';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
