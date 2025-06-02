import React from 'react';

const SideNavBar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-sky-600/90 text-white z-50">
            <div className="p-6">
                <button onClick={onClose} className="text-white text-2xl absolute top-4 right-6">&times;</button>
                <div className='logo text-center inline-block'>
                        <img src='/src/assets/images/logos/Complete Logo.png' alt='Logo' className='h-10 inline-block mr-2' />
                </div>
                <div className='my-4'>
                    <ul className="space-y-4">
                        <li><a href="#">Video Player</a></li>
                        <li><a href="#">More</a></li>
                        <li><a href="#">About us</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideNavBar;
