import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';

const chartWidth = 800;
const chartHeight = 700;

function AnalysisToolComponent() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('AnalysisTool loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('iframe');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };
    }, []);
    return <iframe id='iframe' style={{ width: '100%', height: '100%' }} src={config.analysis_tool_chart.url} />;
}

export default class AnalysisTool extends Dialog {
    constructor() {
        super('analysis-tool-dialog', translate(config.analysis_tool_chart.label), <AnalysisToolComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
