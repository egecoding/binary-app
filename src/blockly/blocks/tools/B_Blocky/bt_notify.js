import { expectValue } from '../../shared';

Blockly.Blocks.bt_notify = {
    init: function init() {
        this.appendValueInput('notification')
            .setCheck(null)
            .appendField('Binarytool')
            .appendField(
                new Blockly.FieldDropdown([
                    ['green', 'success'],
                    ['red', 'error'],
                    ['yellow', 'warn'],
                    ['blue', 'info'],
                ]),
                'color_schemes'
            )
            .appendField('sound')
            .appendField(
                new Blockly.FieldDropdown([
                    ['Silent', 'silent'],
                    ['Job done', 'job-done'],
                    ['Profit', 'earned-money'],
                    ['Announcement', 'announcement'],
                    ['Error', 'error'],
                    ['Severe error', 'severe-error'],
                ]),
                'sound'
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#dedede');
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript.bt_notify = block => {
    const notificationType = block.getFieldValue('color_schemes');
    const sound = block.getFieldValue('sound');
    const message = expectValue(block, 'notification');
    const code = `Bot.notify({ className: '${notificationType}', message: ${message}, sound: '${sound}'});`;
    return code;
};
