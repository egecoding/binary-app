import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';

const chartWidth = 900;
const chartHeight = 800;

function RobotToolComponent() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('AI Robot loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('iframe');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };
    }, []);
    return <iframe id='iframe' style={{ width: '100%', height: '100%' }} src={config.robot_tool_chart.url} />;
}

export default class RobotTool extends Dialog {
    constructor() {
        super('robot-tool-dialog', translate(config.robot_tool_chart.label), <RobotToolComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
