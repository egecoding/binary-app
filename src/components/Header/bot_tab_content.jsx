import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from '@i18n';
import { VH_Variables } from '../../blockly/blocks/vh_shared';

const BotsTabContent = ({ tab = 'real', isActive, setIsAccDropdownOpen, accounts, title, isMain }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(isMain);
    const itemRefs = useRef([]);
    const accordionHeaderRef = useRef(null); // Ref for the accordion header
    const isReal = tab === 'real';

    const onChangeAccount = id => {
        VH_Variables.global_blocky.loadCustomBot(id);
        setIsAccDropdownOpen(false);
    };

    const nameSpanStyle = {
        padding: '6px',
    };

    useEffect(() => {
        // Function to handle click event for accordion header
        const toggleAccordion = () => {
            setIsAccordionOpen(!isAccordionOpen);
        };

        // Attach event listener to accordion header
        const headerElement = accordionHeaderRef.current;
        if (headerElement) {
            headerElement.addEventListener('click', toggleAccordion);
        }

        // Attach event listeners to account items
        accounts.forEach((account, index) => {
            if (isReal !== Boolean(account.isAutomated)) {
                const element = itemRefs.current[index];
                if (element) {
                    const handleClick = e => {
                        e.stopPropagation();
                        onChangeAccount(account.path);
                    };
                    element.addEventListener('click', handleClick);
                }
            }
        });

        // Cleanup function to remove event listeners
        return () => {
            if (headerElement) {
                headerElement.removeEventListener('click', toggleAccordion);
            }
            itemRefs.current.forEach((element, index) => {
                if (element && accounts[index]) {
                    const handleClick = e => {
                        e.stopPropagation();
                        onChangeAccount(accounts[index].path);
                    };
                    element.removeEventListener('click', handleClick);
                }
            });
        };
    }, [accounts, isReal, onChangeAccount, isAccordionOpen]); // Dependencies

    return (
        <div className={`account__switcher-tabs-content ${isActive ? '' : 'hide'}`}>
            <div className='account__switcher-accordion'>
                {accounts && accounts.length > 0 && (
                    <h3
                        className='ui-accordion-header ui-state-default'
                        ref={accordionHeaderRef} // Set the ref here
                    >
                        <div className='account__switcher-accordion-header-text'>
                            <span>{translate(title)}</span>
                            <img
                                className={`header__expand ${isAccordionOpen ? 'open' : ''}`}
                                src='/public/images/ic-chevron-down.svg'
                            />
                        </div>
                    </h3>
                )}
                <div className={`account__switcher-list ${isAccordionOpen ? 'open' : ''}`}>
                    {accounts &&
                        accounts.length > 0 &&
                        accounts.map((account, index) => {
                            if (isReal !== Boolean(account.isAutomated)) {
                                return (
                                    <div
                                        className={classNames('account__switcher-acc', {
                                            'account__switcher-acc--active': '',
                                        })}
                                        key={index}
                                        ref={el => (itemRefs.current[index] = el)}
                                    >
                                        <input type='hidden' name='account_name' value={account.name} />
                                        <span style={nameSpanStyle}>{account.name}</span>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                </div>
            </div>
        </div>
    );
};

BotsTabContent.propTypes = {
    accounts: PropTypes.array,
    isActive: PropTypes.bool,
    setIsAccDropdownOpen: PropTypes.func,
    tab: PropTypes.string,
};

export default BotsTabContent;
