import React from 'react';
// import {  FaTelegram } from 'react-icons/fa';
// import { FaHouseUser } from 'react-icons/fa';
// import { FaCompass } from 'react-icons/fa';
// import { FaWhatsappSquare } from 'react-icons/fa';
// import { FaTiktok } from 'react-icons/fa';
// import { FaYoutube } from 'react-icons/fa';
// import { BsCpuFill } from 'react-icons/bs';
// import { FaComment } from 'react-icons/fa';






// import './footer.scss';

const FooterIconSeparator = () => <div className='footer__icon-separator' />;
const FooterIconSeparat = () => <div className='footer__icon-separat' />;

const SocialMediaIcons = () => (
    <div className='footer__social-media'>
        {/* <a href="https://binarytool.site/" target='_blank' rel='noopener noreferrer' style={{  backgroundColor: '#151924', padding: '7px'}}>
            <span style={{ color: '#149aa8' }}>Home</span>
        </a>
        <a href="https://binarytool.site/robot.html" target='_blank' rel='noopener noreferrer' style={{  backgroundColor: '#151924', padding: '7px'}}>
            <span style={{ color: '#149aa8' }}>AI Bot</span>
        </a>
        <a href="https://t.me/binarytools" target='_blank' rel='noopener noreferrer' style={{ backgroundColor: '#151924', padding: '7px'}}>
            <span style={{ color: '#149aa8' }}>Telegram</span>
        </a>
        <a href="https://chat.whatsapp.com/JFqwVSzksZBA3YUpeWHyW9" target='_blank' rel='noopener noreferrer' style={{ backgroundColor: '#151924', padding: '7px'}}>
            <span style={{ color: '#149aa8' }}>Whatsapp</span>
        </a>
        <a href="https://www.tiktok.com/@binarytools?_t=8jPNXTTd5kM&_r=1" target='_blank' rel='noopener noreferrer' style={{backgroundColor: '#151924', padding: '7px'}}>
            <span style={{ color: '#149aa8' }}>Tiktok</span>
        </a>
        <a href="https://youtube.com/@Binarytool165" target='_blank' rel='noopener noreferrer' style={{ backgroundColor: '#151924', padding: '7px' }}>
            <span style={{ color: '#149aa8' }}>Youtube</span>
        </a> */}
    </div>

);

const Footer = () => (
    <footer className='footer'>
        <div className='footer__links'>
            <SocialMediaIcons />
            <FooterIconSeparator />
            {/* Add other components or links here */}
        </div>
    </footer>
);

export default Footer;
