import React from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from '@utils';
import { translate } from '@i18n';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const CloseButton = ({ onClick }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='23'
        height='23'
        viewBox='0 0 24 24'
        fill='none'
        stroke='#ffffff'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
        onClick={onClick}
        style={{ cursor: 'pointer' }}
    >
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
);

const CustomBeaconComponent = ({ closeTourPermanently, continueTour, videoIds }) => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '999' }}>
                <CloseButton onClick={closeTourPermanently} />
            </div>
            <div className='tour__beacon'>
                <Carousel responsive={responsive} swipeable={true} draggable={false} showDots={true} infinite={true}>
                    {videoIds.map(id => (
                        <div key={id} className='tour__video'>
                            <iframe
                                width='100%'
                                height='315'
                                src={`https://www.youtube.com/embed/${id}`}
                                title='YouTube Video'
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
};

CustomBeaconComponent.propTypes = {
    closeTourPermanently: () => {},
    continueTour: () => {},
};

function Welcome(closeTourPermanently, continueTour) {
    const { is_logged } = useSelector(state => state.client);

    const steps = [
        {
            content: (
                <CustomBeaconComponent
                    closeTourPermanently={closeTourPermanently}
                    continueTour={continueTour}
                    videoIds={['eKMcCUnJ9S8', 'DsxCCCJCic0', 'FGtGpP8qX7Y']}
                />
            ),
            target: '#first-step-target',
            placement: 'center',
            offset: 200,
            disableBeacon: true,
            hideCloseButton: true,
            styles: {
                buttonNext: {
                    display: 'none',
                },
                tooltipContent: {
                    textAlign: 'center',
                },
                tooltipTitle: {
                    textAlign: 'center',
                },
            },
        },
    ];

    return steps;
}

Welcome.propTypes = {
    closeTourPermanently: () => {},
    continueTour: () => {},
};

export default Welcome;
