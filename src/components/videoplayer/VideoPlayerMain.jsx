import React, { useState, useEffect, useContext } from 'react';
import MobileOption from './MobileOption';
import DesktopOption from './DesktopOption';
import VideoContext from '../../context/video/VideoContext';
import UserContext from '../../context/user/UserContext';
import WebSocketContext from '../../context/websocket/WebsocketContext';


const VideoPlayerMain = ({ trimmedCode }) => {
  const [showDevices, setShowDevices] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { getCurrentVideo, getAllVideos } = useContext(VideoContext);
  const { createOrUpdateCode } = useContext(UserContext);
  const { createConnection } = useContext(WebSocketContext);


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
      createOrUpdateCode(trimmedCode);
      createConnection(trimmedCode);
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

  const handleDeviceSelect = async (device) => {
  setSelectedDevice(device);
  if(device === 'mobile') {
    getAllVideos(trimmedCode);
  }
  else if(device === 'desktop') {
    getCurrentVideo(trimmedCode);    
  }
};


  return (
    <div className="w-full h-full">
      <div className="h-16 flex justify-end items-center px-2 space-x-2 sm:space-x-4">
        {/* <button
          onClick={toggleDevices}
          className="w-1/4 sm:w-1/12 h-full bg-white text-sky-500 font-semibold px-4 sm:px-6 py-2 rounded-none hover:bg-sky-400 hover:text-white transition"
        >
          Slider
        </button> */}

        {showDevices && (
          <>
            {/* <button
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
            </button> */}
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
