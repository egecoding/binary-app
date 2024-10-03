import React, { useEffect } from 'react';
import { GoHubot } from 'react-icons/go';
import { FaRegCopyright } from 'react-icons/fa';
import { MdOutlineAnalytics, MdWbSunny } from 'react-icons/md';
import config from '@config';
import { translate } from '@i18n';

function LoginPopDialog() {
    useEffect(() => {
        // Your code here will run after the DOM is fully loaded
    }, []); // Empty dependency array ensures it runs only once after the initial render

    const onLogin = () => {
        document.location = config.login.getURL();
    };

    const onSignUp = () => {
        window.location.href = 'https://track.deriv.com/_2yZaBZhr48dMjdsyM5hasGNd7ZgqdRLk/1/';
    };

    const onAnalysis = () => {
        window.location.href = 'https://app.binarytool.site/bot#pro-analysistool';
    };
    
    return (
        <div className='login_pop_main'>
            <dialog open>
                <h2>www.binarytool.site</h2>
                <h5>
                    Powered by <span style={{ color: 'red' }}>deriv</span>
                </h5>
                <p>
                    Unlock exclusive trading features not available on the official platform – elevate your trading
                    experience today
                </p>
                <div className='items_list'>
                    <div className='item'>
                        <div className='icon_tool'>
                            <MdOutlineAnalytics />
                        </div>
                        <div className='icon_text'>Analysis Tool</div>
                    </div>
                    <div className='item'>
                        <div className='icon_tool'>
                            <FaRegCopyright />
                        </div>
                        <div className='icon_text'>CopyTrading</div>
                    </div>
                    <div className='item'>
                        <div className='icon_tool'>
                            <GoHubot />
                        </div>
                        <div className='icon_text'>PreSaved Bots</div>
                    </div>
                </div>

                <footer>
                    <button className='login_now' onClick={onLogin}>
                        {translate(config.login.label)}
                    </button>
                    <button onClick={onSignUp}>{translate(config.signup.label)}</button>
                </footer>
                {/* Social Links and Other Tools Section */}
                <section style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        {/* WhatsApp Link */}
                        <a href="https://app.binarytool.site/bot" style={{ textDecoration: 'none', color: 'red', display: 'flex', alignItems: 'center' }}>
                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                                <path d="M0 6a6 6 0 016-6h20a6 6 0 016 6v20a6 6 0 01-6 6H6a6 6 0 01-6-6V6z" fill="#FF444F"></path>
                                <path d="M6 0a6 6 0 00-6 6v.174l29.914-4.721A5.976 5.976 0 0026 0H6zm24.532 2.068L25.044 32H26a6 6 0 006-6V6c0-1.504-.553-2.88-1.468-3.932z" fill="#E12E3A"></path>
                                <path d="M9.544 19.066c.102.01.22.019.35.028h.49c1.092 0 1.9-.275 2.422-.826.532-.55.798-1.311.798-2.282 0-1.017-.252-1.787-.756-2.31-.504-.523-1.302-.784-2.394-.784-.15 0-.304.005-.462.014-.159 0-.308.01-.448.028v6.132zm6.314-3.08c0 .84-.13 1.573-.392 2.198a4.039 4.039 0 01-1.12 1.554c-.476.41-1.06.719-1.75.924-.69.206-1.466.308-2.324.308-.392 0-.85-.018-1.372-.056a10.521 10.521 0 01-1.54-.196v-9.45a12.002 12.002 0 011.568-.182 21.39 21.39 0 011.414-.056c.83 0 1.582.094 2.254.28.681.187 1.264.48 1.75.882a3.92 3.92 0 011.12 1.54c.261.626.392 1.377.392 2.254zm4.358 4.984c-.532 0-1.064-.018-1.596-.056a10.587 10.587 0 01-1.638-.224v-9.408a12.83 12.83 0 011.47-.182 17.08 17.08 0 011.484-.07c.616 0 1.18.047 1.694.14.523.084.97.233 1.344.448.374.215.663.5.868.854.215.346.322.775.322 1.288 0 .775-.373 1.386-1.12 1.834.616.234 1.036.55 1.26.952.224.402.336.854.336 1.358 0 1.018-.373 1.783-1.12 2.296-.737.514-1.838.77-3.304.77zm-1.106-4.354v2.506c.159.019.332.033.518.042.187.01.392.014.616.014.654 0 1.18-.093 1.582-.28.402-.186.602-.532.602-1.036 0-.448-.168-.765-.504-.952-.336-.196-.816-.294-1.442-.294H19.11zm0-1.666h1.064c.672 0 1.153-.084 1.442-.252.29-.177.434-.457.434-.84 0-.392-.15-.667-.448-.826-.299-.159-.737-.238-1.316-.238-.187 0-.387.005-.602.014-.215 0-.406.01-.574.028v2.114z" fill="#fff"></path>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>DBOT</div>
                        </a>
                        <a href="https://binarytool.site/robot.html" style={{ textDecoration: 'none', color: 'RED', display: 'flex', alignItems: 'center' }}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="#FF0000"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                                <rect x="9" y="9" width="6" height="6" />
                                <line x1="9" y1="1" x2="9" y2="4" />
                                <line x1="15" y1="1" x2="15" y2="4" />
                                <line x1="9" y1="20" x2="9" y2="23" />
                                <line x1="15" y1="20" x2="15" y2="23" />
                                <line x1="20" y1="9" x2="23" y2="9" />
                                <line x1="20" y1="14" x2="23" y2="14" />
                                <line x1="1" y1="9" x2="4" y2="9" />
                                <line x1="1" y1="14" x2="4" y2="14" />
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>AI ROBOT</div>
                        </a>                     
                    </div>
                </section>             
                <footer class="footer">
                    <button class="button-85" role="button" onClick={onAnalysis}>PRO-ANALYSIS TOOL</button>
                </footer>
                {/* Social Links and Other Tools Section */}
                <section style={{ marginTop: '10px' }}>
                    <h3 style={{ textAlign: 'center' }}>SOCIAL MEDIA PLATFORM</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        {/* WhatsApp Link */}
                        <a href="https://chat.whatsapp.com/JFqwVSzksZBA3YUpeWHyW9" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg width="20px" height="20px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z" fill="#BFC8D0"/>
                                <path d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" fill="url(#paint0_linear_87_7264)"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z" fill="white"/>
                                <path d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z" fill="white"/>
                                <defs>
                                    <linearGradient id="paint0_linear_87_7264" x1="26.5" y1="7" x2="4" y2="28" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#5BD066"/>
                                        <stop offset="1" stopColor="#27B43E"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>WhatsApp</div>
                        </a>
                        <a href="https://t.me/binarytools" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg width="20px" height="20px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)"/>
                                <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"/>
                                <defs>
                                    <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#37BBFE"/>
                                        <stop offset="1" stopColor="#007DBB"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>Channel</div>
                        </a>                     
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <a href="https://t.me/binarytoolsite" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#59AAE7" fill="#59AAE7"><path d="M26.67,38.57l-.82,11.54A2.88,2.88,0,0,0,28.14,49l5.5-5.26,11.42,8.35c2.08,1.17,3.55.56,4.12-1.92l7.49-35.12h0c.66-3.09-1.08-4.33-3.16-3.55l-44,16.85C6.47,29.55,6.54,31.23,9,32l11.26,3.5L45.59,20.71c1.23-.83,2.36-.37,1.44.44Z" strokeLinecap="round"/>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>Community</div>
                        </a>
                        <a href="https://www.tiktok.com/@binarytools?_t=8jPNXTTd5kM&_r=1" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg width="20px" height="20px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="#EE1D52"/>
                                <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="#000000"/>
                                <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="#69C9D0"/>
                                <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="#69C9D0"/>
                                <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="#69C9D0"/>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>Tiktok</div>
                        </a>                      
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <a href="https://www.youtube.com/@Binarytool165" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="red" d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"/><path fill="#ffffff" d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"/>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>Youtube</div>
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.binarytools.binary_tools" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="0.91em" height="1em" viewBox="0 0 256 283"><path fill="#ea4335" d="M119.553 134.916L1.06 259.061a32.14 32.14 0 0 0 47.062 19.071l133.327-75.934z"/><path fill="#fbbc04" d="M239.37 113.814L181.715 80.79l-64.898 56.95l65.162 64.28l57.216-32.67a31.345 31.345 0 0 0 0-55.537z"/><path fill="#4285f4" d="M1.06 23.487A30.565 30.565 0 0 0 0 31.61v219.327a32.333 32.333 0 0 0 1.06 8.124l122.555-120.966z"/><path fill="#34a853" d="m120.436 141.274l61.278-60.483L48.564 4.503A32.847 32.847 0 0 0 32.051 0C17.644-.028 4.978 9.534 1.06 23.399z"/>
                            </svg>
                            <div style={{ marginTop: '5px', marginLeft: '10px' }}>Install App</div>
                        </a>                      
                    </div>
                    
                </section>
                {/* YouTube Embedded Video */}
                <h3 style={{ textAlign: 'center' }}>Risk Disclaimer</h3>
                <p>
                    Deriv offers complex derivatives, such as options and contracts for difference (“CFDs”). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: 
                    a) you may lose some or all of the money you invest in the trade, 
                    b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.
                </p>
            </dialog>
        </div>
    );
}

export default LoginPopDialog;
