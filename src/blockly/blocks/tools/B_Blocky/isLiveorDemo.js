import { translate } from '@i18n';

Blockly.Blocks.is_liveordemo = {
    init: function init() {
        this.appendDummyInput().appendField(translate('is Live Account'));
        this.setOutput(true, 'String');
        this.setColour('#dedede');
        this.setTooltip(translate('Switch to Live Account.'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
};
Blockly.JavaScript.is_liveordemo = () => {
    const code = 'Bot.AccountTypeStatus()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
