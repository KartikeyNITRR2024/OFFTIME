import React, { useState, useContext, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp
} from 'react-icons/fa';
import VideoContext from '../../context/video/VideoContext';
import WebSocket from '../../property/Websocket';
import Microservices from '../../property/Microservices';
import WebSocketContext from '../../context/websocket/WebsocketContext';

function Controller({ trimmedCode }) {
  const { currentVideo, videos } = useContext(VideoContext);
  const { sendWork } = useContext(WebSocketContext);
  const { setCurrentVideofun, videoPaused, setVideoPaused, playInLoop, setPlayInLoop, muted, setMuted } = useContext(VideoContext);

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
    setVideoPaused(!videoPaused);
    const currentVideoId = currentVideo.id;
    const nextVideo = videos.find(video => video.id > currentVideoId);
    var nextVideoId = videos[0].id;
    if(nextVideo) {
      nextVideoId = nextVideo.id;
    }
    changeCurrentVideo(nextVideoId);
    setVideoPaused(!videoPaused);
  };

  const handlePrevious = async () => {
    setVideoPaused(!videoPaused);
    const currentVideoId = currentVideo.id;
    const previousVideo = [...videos].reverse().find(video => video.id < currentVideoId);
    var previousVideoId = videos[videos.length-1].id;
    if(previousVideo) {
       previousVideoId = previousVideo.id;
    }
    changeCurrentVideo(previousVideoId);
    setVideoPaused(!videoPaused);
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

        <button onClick={() => setVideoPaused(!videoPaused)} title={videoPaused ? 'Pause' : 'Play'}>
           {videoPaused ? <FaPause /> : <FaPlay />}
        </button>

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
