import { notify } from '../../../bot/broadcast';
import { VH_Variables } from '../../vh_shared';
import { authorizeAccount, cleanToken } from './allow_vh';
import { getBlocksByType } from '../../../utils';
let isLoaded = false;
Blockly.Blocks.vh_settings = {
    init: function init() {
        this.appendDummyInput().appendField('Binarytool Bot');
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Enable Virtual Trades:')
            .appendField(
                new Blockly.FieldDropdown([
                    ['true', 'true'],
                    ['false', 'false'],
                ]),
                'allow_vh'
            );
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Enable Martingale:')
            .appendField(
                new Blockly.FieldDropdown([
                    ['true', 'true'],
                    ['false', 'false'],
                ]),
                'allow_martingale'
            );
        this.appendValueInput('martingale_factor')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Martingale:');
        this.appendValueInput('vitual_token')
            .setCheck('String')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Virtual Account Token');
        this.appendValueInput('max_steps').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField('No. of Consecutive Virtual Losses:');
        this.appendValueInput('min_real_trades')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Min. Trades on Real:');
        this.appendValueInput('take_profit:')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Take Profit:');
        this.appendValueInput('stop_loss').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField('Stop Loss:');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript.vh_settings = block => {
    const virtual_token = Blockly.JavaScript.valueToCode(block, 'vitual_token', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.virtual_account_token = virtual_token.trim();
    const allow_vh_status = block.getFieldValue('allow_vh');
    const allow_martingale = block.getFieldValue('allow_martingale');
    // Activating/Disabling Martingale
    if (allow_martingale === 'true') {
        VH_Variables.allow_martingale = true;
    } else {
        VH_Variables.allow_martingale = false;
    }
    // authenticating Virtual Hook Account
    if (allow_vh_status === 'true') {
        VH_Variables.allow_VH = true;
        VH_Variables.isVHActive = true;
        notify('success', 'Virtual Hook Enabled', 'job-done');
        authorizeAccount(cleanToken(VH_Variables.virtual_account_token));
    } else {
        VH_Variables.allow_VH = false;
        VH_Variables.isVHActive = false;
        notify('warn', 'Virtual Hook Disabled', 'job-done');
    }
    const martingale_factor = Blockly.JavaScript.valueToCode(
        block,
        'martingale_factor',
        Blockly.JavaScript.ORDER_ATOMIC
    );
    VH_Variables.martingale_factor = parseFloat(martingale_factor);
    const max_steps = Blockly.JavaScript.valueToCode(block, 'max_steps', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.max_steps = parseFloat(max_steps);
    const min_real_trades = Blockly.JavaScript.valueToCode(block, 'min_real_trades', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.min_trades_real = parseFloat(min_real_trades);
    const take_profit = Blockly.JavaScript.valueToCode(block, 'take_profit:', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.take_profit = parseFloat(take_profit);
    const stop_loss = Blockly.JavaScript.valueToCode(block, 'stop_loss', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.stop_loss = parseFloat(stop_loss);

    // TODO: Assemble javascript into code variable.
    const code = 'Bot.notify({ className: "warn", message: "Bot started", sound: "silent"});';
    return code;
};
