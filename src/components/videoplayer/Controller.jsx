import React, { useContext, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
  FaExclamationCircle,
  FaSpinner 
} from 'react-icons/fa';
import VideoContext from '../../context/video/VideoContext';
import WebSocket from '../../property/Websocket';
import Microservices from '../../property/Microservices';
import WebSocketContext from '../../context/websocket/WebsocketContext';
import {toast} from "react-toastify";

function Controller({ trimmedCode }) {
  const { currentVideo, videos } = useContext(VideoContext);
  const { sendWork, isPlayerConnected } = useContext(WebSocketContext);
  const { setLockPlayPauseButton, 
          setCurrentVideofun, 
          videoPaused, 
          setVideoPaused, 
          playInLoop, 
          setPlayInLoop, 
          muted, 
          setMuted, 
          lockPlayPauseButton,
          isBuffering
        } = useContext(VideoContext);

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
    if (WebSocket.USING_WEBSOCKET) {
      const workDetail = {
        pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
        workType: "VIDEO",
        uniqueCode: trimmedCode,
        workId: "PLAYINLOOP",
        payload: playInLoop
      };
      sendWork(workDetail);
    } else {
      alert("WebSocket is not using, please check your connection.");
    }
  }, [playInLoop]);

  useEffect(() => {
    if (WebSocket.USING_WEBSOCKET) {
      const workDetail = {
        pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
        workType: "VIDEO",
        uniqueCode: trimmedCode,
        workId: "MUTEAUDIO",
        payload: muted
      };
      sendWork(workDetail);
    } else {
      alert("WebSocket is not using, please check your connection.");
    }
  }, [muted]);

  if (!currentVideo) return null;

  const currentSong = currentVideo.videoName;


  const handleNext = async () => {
    // var videoPaused1 = videoPaused;
    // setVideoPaused(false);
    const currentVideoId = currentVideo.id;
    const nextVideo = videos.find(video => video.id > currentVideoId);
    var nextVideoId = videos[0].id;
    if(nextVideo) {
      nextVideoId = nextVideo.id;
    }
    changeCurrentVideo(nextVideoId);
    // setVideoPaused(videoPaused1);
  };

  const handlePrevious = async () => {
    // var videoPaused1 = videoPaused;
    // setVideoPaused(false);
    const currentVideoId = currentVideo.id;
    const previousVideo = [...videos].reverse().find(video => video.id < currentVideoId);
    var previousVideoId = videos[videos.length-1].id;
    if(previousVideo) {
       previousVideoId = previousVideo.id;
    }
    changeCurrentVideo(previousVideoId);
    // setVideoPaused(videoPaused1);
  };

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
  }

  return (
    <div className="flex items-center justify-between px-4 py-6">
      <div className="text-sm font-medium text-white truncate">
        <span className="font-semibold">{currentSong}</span>
      </div>

      <div className="flex items-center space-x-4 text-xl text-white">
        {!playInLoop && (
          <button onClick={handlePrevious} title="Previous">
            <FaBackward />
          </button>
        )}

       <div className="relative flex items-center gap-2">
        <button
          onClick={() => {
            setLockPlayPauseButton(true);
            setVideoPaused(!videoPaused);
          }}
          title={videoPaused ? 'Pause' : 'Play'}
          disabled={lockPlayPauseButton || !isPlayerConnected}
          className={`px-3 py-2 rounded flex items-center gap-2 ${
            lockPlayPauseButton
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-sky-600 text-white'
          }`}
        >
          {!isPlayerConnected ? (
            <FaExclamationCircle
              title="Player not found"
              onClick={(e) => {
                e.stopPropagation();
                toast.error('❌ Player not found');
              }}
              className="text-white"
            />
          ) : isBuffering ? (
            <FaSpinner className="animate-spin" title="Buffering..." />
          ) : !videoPaused ? (
            <FaPlay />
          ) : (
            <FaPause />
          )}
        </button>
      </div>

        {!playInLoop && (
          <button onClick={handleNext} title="Next">
            <FaForward />
          </button>
        )}

        <button
          onClick={() => setPlayInLoop(!playInLoop)}
          className={playInLoop ? 'text-blue-400' : 'text-white'}
          title="Loop"
        >
          <FaRedo />
        </button>

        <button onClick={() => setMuted(!muted)} title={muted ? 'Unmute' : 'Mute'}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
    </div>
  );
}

export default Controller;
