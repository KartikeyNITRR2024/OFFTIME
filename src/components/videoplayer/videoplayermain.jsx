import React, { useState, useEffect, useContext } from 'react';
import MobileOption from './mobileoption';
import DesktopOption from './desktopoption';
import UserContext from '../../context/user/UserContext';

const VideoPlayerMain = ({ trimmedCode }) => {
  const [showDevices, setShowDevices] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { createOrUpdateCode } = useContext(UserContext);


  const isMobileDevice = () => window.innerWidth <= 768;

  useEffect(() => {
    const init = async () => {
      if (isMobileDevice()) {
        setSelectedDevice('mobile');
        setShowDevices(true);
      } else {
        setSelectedDevice('desktop');
        setShowDevices(true);
      }

      if (trimmedCode) {
        try {
          await createOrUpdateCode(trimmedCode);
        } catch (error) {
          console.error('Error during createOrUpdateCode:', error);
        }
      }
    };

    init();

    const handleResize = () => {
      setSelectedDevice(isMobileDevice() ? 'mobile' : 'desktop');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDevices = () => {
    setShowDevices(prev => !prev);
    if (showDevices) setSelectedDevice(null);
  };

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="w-full h-full">
      <div className="h-16 flex justify-end items-center px-2 space-x-2 sm:space-x-4">
        <button
          onClick={toggleDevices}
          className="w-1/4 sm:w-1/12 h-full bg-white text-sky-500 font-semibold px-4 sm:px-6 py-2 rounded-none hover:bg-sky-400 hover:text-white transition"
        >
          Slider
        </button>

        {showDevices && (
          <>
            <button
              onClick={() => handleDeviceSelect('mobile')}
              className={`w-1/4 sm:w-1/12 h-full px-4 sm:px-6 py-2 font-semibold rounded-none transition
                ${selectedDevice === 'mobile'
                  ? 'bg-sky-400 text-white'
                  : 'bg-white text-sky-500 hover:bg-sky-400 hover:text-white'
                }`}
            >
              Mobile
            </button>
            <button
              onClick={() => handleDeviceSelect('desktop')}
              className={`w-1/4 sm:w-1/12 h-full px-4 sm:px-6 py-2 font-semibold rounded-none transition
                ${selectedDevice === 'desktop'
                  ? 'bg-sky-400 text-white'
                  : 'bg-white text-sky-500 hover:bg-sky-400 hover:text-white'
                }`}
            >
              Desktop
            </button>
          </>
        )}
      </div>

      <div className="mt-4">
        {selectedDevice === 'mobile' && <MobileOption  trimmedCode={trimmedCode} setSelectedDevice={setSelectedDevice} />}
        {selectedDevice === 'desktop' && <DesktopOption  trimmedCode={trimmedCode}  />}
      </div>
    </div>
  );
};

export default VideoPlayerMain;
