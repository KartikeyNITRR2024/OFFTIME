import React, { useState, useContext } from 'react';
import VideoContext from '../../context/video/videocontext';
import Loader from '../loader/loader';

const MobileOption = () => {
  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(315);
  const [audioOnly, setAudioOnly] = useState(false);
  const { currentVideo, updateVideo } = useContext(VideoContext);

  if (!currentVideo) {
    return <Loader />;
  }



  const increaseWidth = () => setWidth((w) => Math.min(w + 50, 1000));
  const decreaseWidth = () => setWidth((w) => Math.max(w - 50, 100));
  const increaseHeight = () => setHeight((h) => Math.min(h + 30, 800));
  const decreaseHeight = () => setHeight((h) => Math.max(h - 30, 100));
  const toggleAudioOnly = () => setAudioOnly((prev) => !prev);

  return (
    <div className="flex flex-row items-center justify-center min-h-screen p-4">
      <div className="flex justify-center items-center flex-grow">
        <iframe
          width={audioOnly ? 1 : width}
          height={audioOnly ? 1 : height}
          style={{
            opacity: audioOnly ? 0 : 1,
            transition: 'opacity 0.3s',
            pointerEvents: audioOnly ? 'none' : 'auto',
          }}
          src={`${currentVideo.videoUrl}?start=${currentVideo.lastStopTime}&autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Control Buttons on Right */}
      <div className="flex flex-col items-end space-y-2 ml-4">
        {!audioOnly && (
          <>
            <button
              onClick={decreaseWidth}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Decrease Width"
            >
              ➖↔️
            </button>
            <button
              onClick={increaseWidth}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Increase Width"
            >
              ➕↔️
            </button>
            <button
              onClick={decreaseHeight}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              title="Decrease Height"
            >
              ➖↕️
            </button>
            <button
              onClick={increaseHeight}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              title="Increase Height"
            >
              ➕↕️
            </button>
          </>
        )}
        <button
          onClick={toggleAudioOnly}
          className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          title="Toggle Audio/Video"
        >
          {audioOnly ? '🎥' : '🎧'}
        </button>
      </div>
    </div>
  );
};

export default MobileOption;
