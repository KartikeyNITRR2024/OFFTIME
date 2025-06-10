import React, { useState, useContext, useEffect, useRef } from 'react';
import VideoContext from '../../context/video/VideoContext';
import Loader from '../loader/Loader';
import ReactPlayer from 'react-player/youtube';
import {
  FaHeadphones, FaVideo,
  FaPlay, FaPause,
  FaExpandArrowsAlt, FaCompressArrowsAlt,
  FaArrowUp, FaArrowDown,
} from 'react-icons/fa';
import WebSocket from '../../property/Websocket';
import Microservices from '../../property/Microservices';
import WebSocketContext from '../../context/websocket/WebsocketContext';

const DesktopOption2 = ({ trimmedCode }) => {
  const {
    currentVideo,
    videoPaused,
    setVideoPaused,
    playInLoop,
    muted,
    videos,
    setCurrentVideofun,
    updateVideo
  } = useContext(VideoContext);

  const { sendWork } = useContext(WebSocketContext);

  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(315);
  const [audioOnly, setAudioOnly] = useState(true);
  const [controls, setControls] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const playerRef = useRef(null);

  useEffect(() => {
    if (WebSocket.USING_WEBSOCKET) {
      const workDetail = {
        pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
        workType: "VIDEO",
        uniqueCode: trimmedCode,
        workId: "PLAY_PAUSE",
        payload: videoPaused
      };
      sendWork(workDetail);
    } else {
      alert("WebSocket is not using, please check your connection.");
    }
  }, [videoPaused]);

  useEffect(() => {
  if (!currentVideo) return;

  const interval = setInterval(() => {
    const sendUpdate = async () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        await updateVideo(trimmedCode, currentVideo.id, Math.floor(currentTime));
      }
    };
    sendUpdate();
  }, 5000);

  return () => clearInterval(interval);
}, [currentVideo, trimmedCode]);


  const songEndFunction = async () => {
    const currentVideoId = currentVideo.id;
    await updateVideo(trimmedCode, currentVideoId, 0);
    const nextVideo = videos.find(video => video.id > currentVideoId);
    var nextVideoId = videos[0].id;
    if (nextVideo) {
      nextVideoId = nextVideo.id;
    }
    changeCurrentVideo(nextVideoId);
  };

  const songStartFunction = async () => {
    if (playerRef.current && currentVideo?.lastStopTime >= 0) {
        playerRef.current.seekTo(currentVideo.lastStopTime, 'seconds');
    }
  }


  const changeCurrentVideo = async (videoId) => {
    if (WebSocket.USING_WEBSOCKET) {
      const workDetail = {
        pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
        workType: "VIDEO",
        uniqueCode: trimmedCode,
        workId: "SETCURRENTVIDEO",
        payload: { id: videoId }
      };
      sendWork(workDetail);
    } else {
      await setCurrentVideofun(trimmedCode, videoId);
    }
  };

  const increment = 40;

  if (!currentVideo) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
          onClick={() => setAudioOnly(!audioOnly)}
          title={audioOnly ? 'Switch to Video Mode' : 'Switch to Audio Only'}
        >
          {audioOnly ? <FaVideo /> : <FaHeadphones />}
          {audioOnly ? 'Video Mode' : 'Audio Only'}
        </button>

        <button
          className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
          onClick={() => setVideoPaused(!videoPaused)}
          title={!videoPaused ? 'Play' : 'Pause'}
        >
          {!videoPaused ? <FaPlay /> : <FaPause />}
          {!videoPaused ? 'Play' : 'Pause'}
        </button>

        {!audioOnly && (
          <>
            <button
              className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
              onClick={() => setWidth(width + increment)}
              title="Increase Width"
            >
              <FaExpandArrowsAlt />
              Width +
            </button>

            <button
              className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
              onClick={() => setWidth(Math.max(100, width - increment))}
              title="Decrease Width"
            >
              <FaCompressArrowsAlt />
              Width -
            </button>

            <button
              className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
              onClick={() => setHeight(height + increment)}
              title="Increase Height"
            >
              <FaArrowUp />
              Height +
            </button>

            <button
              className="px-3 py-2 bg-sky-600 text-white rounded flex items-center gap-2"
              onClick={() => setHeight(Math.max(100, height - increment))}
              title="Decrease Height"
            >
              <FaArrowDown />
              Height -
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center items-center flex-grow">
        <ReactPlayer
          ref={playerRef}
          url={currentVideo.videoUrl}
          playing={videoPaused}
          controls={controls}
          loop={playInLoop}
          volume={volume}
          muted={muted}
          width={audioOnly ? 0 : width}
          height={audioOnly ? 0 : height}
          style={audioOnly ? { visibility: 'hidden', position: 'absolute' } : {}}
          onEnded={songEndFunction}
          onReady={songStartFunction}
        />
      </div>
    </div>
  );
};

export default DesktopOption2;
