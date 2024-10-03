import { VH_Variables } from '../../vh_shared';
import { getBlocksByType } from '../../../utils';
let isLoaded = false;
Blockly.Blocks.risk_managment = {
    init: function init() {
        this.appendDummyInput().appendField('Risk Managment');
        this.appendDummyInput()
            .appendField('Enable Martingale:')
            .appendField(
                new Blockly.FieldDropdown([
                    ['true', 'true'],
                    ['false', 'false'],
                ]),
                'martingale_choice'
            );
        this.appendValueInput('martingale')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Martingale Factor:');
        this.appendValueInput('take_profit')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Take Profit:');
        this.appendValueInput('stop_loss').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField('Stop Loss:');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('');
        this.setHelpUrl('');
    },

};

Blockly.JavaScript.risk_managment = block => {
    const martingale_choice = block.getFieldValue('martingale_choice');

    if (martingale_choice === 'true') {
        VH_Variables.allow_martingale = true;
    } else {
        VH_Variables.allow_martingale = false;
    }
    const martingale_factor = Blockly.JavaScript.valueToCode(block, 'martingale', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.martingale_factor = parseFloat(martingale_factor);
    const take_profit = Blockly.JavaScript.valueToCode(block, 'take_profit', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.take_profit = parseFloat(take_profit);
    const stop_loss = Blockly.JavaScript.valueToCode(block, 'stop_loss', Blockly.JavaScript.ORDER_ATOMIC);
    VH_Variables.stop_loss = parseFloat(stop_loss);
    // TODO: Assemble javascript into code variable.
    const code = '';
    return code;
};
