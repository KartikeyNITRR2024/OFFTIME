import React, { useState, useEffect } from 'react';
import SideNavBar from './sidenavbar';
import { useParams, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCodePresentInUrl, setIsCodePresentInUrl] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const trimmedCode = code?.trim();
        if (
            !trimmedCode ||
            trimmedCode.length < 5 ||
            trimmedCode.length > 10
        ) {
            setIsCodePresentInUrl(false);
        }
    }, [code, navigate]);

    return (
        <header className='bg-sky-600/90 text-white h-18'>
            {isCodePresentInUrl && (<SideNavBar isOpen={isSidebarOpen} onClose={closeSidebar} />)}
            <div className='navbar'>
                <div className='flex justify-between items-center py-3 px-8'>
                    <div className='logo text-center lg:hidden'>
                        <img src='/src/assets/images/logos/whiteinbluelogo.png' alt='Logo' className='h-9 inline-block mr-2' />
                    </div>
                    <div className='logo text-center hidden lg:inline-block'>
                        <img src='/src/assets/images/logos/Complete Logo.png' alt='Logo' className='h-10 inline-block mr-2' />
                    </div>
                    {isCodePresentInUrl && (<><div className='hamburger inline-block p-4 cursor-pointer lg:hidden' onClick={toggleSidebar}>
                        <div className='line h-1 w-8 my-1 bg-white'></div>
                        <div className='line h-1 w-8 my-1 bg-white'></div>
                        <div className='line h-1 w-8 my-1 bg-white'></div>
                    </div>
                    <div className='hidden lg:inline-block align-middle my-1'>
                        <ul className='list-none inline-flex space-x-7'>
                            <li><a href='#' className='text-white hover:text-gray-200 cursor-pointer'>Video Player</a></li>
                            <li><a href='#' className='text-white hover:text-gray-200 cursor-pointer'>More</a></li>
                        </ul>
                    </div></>)}
                </div>
            </div>
        </header>
    );
};

export default Header;
