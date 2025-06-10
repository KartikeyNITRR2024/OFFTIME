import React, { useState, useEffect, useContext } from 'react';
import VideoContext from '../../context/video/VideoContext';
import WebSocketContext from '../../context/websocket/WebsocketContext';
import WebSocket from '../../property/Websocket';
import Microservices from '../../property/Microservices';
import Controller from './Controller';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';

const convertToEmbedUrl = (url) => {
  try {
    const ytMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url;
  } catch {
    return url;
  }
};

const MobileOption2 = ({ trimmedCode }) => {
  const { videos, deleteVideo, saveVideo, setCurrentVideofun, getAllVideos, currentVideo, videoPaused, setVideoPaused } = useContext(VideoContext);
  const { sendWork } = useContext(WebSocketContext);

  const [fields, setFields] = useState(() =>
    videos.length > 0
      ? videos.map(video => ({
          id: video.id,
          value: video.videoUrl,
          videoName: video.videoName || '',
          isPlaying: false,
          lastStopTime: video.lastStopTime || 0,
          isSaved: true,
        }))
      : [{
          id: Date.now(),
          value: '',
          videoName: '',
          isPlaying: false,
          lastStopTime: 0,
          isSaved: false,
        }]
  );

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
    if (videos.length > 0) {
      setFields(
        videos.map(video => ({
          id: video.id,
          value: video.videoUrl,
          videoName: video.videoName || '',
          isPlaying: false,
          lastStopTime: video.lastStopTime || 0,
          isSaved: true,
        }))
      );
    }
  }, [videos]);

  const addField = () => {
    setFields(prev => [
      ...prev,
      {
        id: Date.now(),
        value: '',
        videoName: '',
        isPlaying: false,
        lastStopTime: 0,
        isSaved: false,
      }
    ]);
  };

  const handleChange = (id, key, newValue) => {
    setFields(prev =>
      prev.map(field =>
        field.id === id
          ? {
              ...field,
              [key]: key === 'value' ? convertToEmbedUrl(newValue) : newValue,
              isSaved: false,
            }
          : field
      )
    );
  };

  const handleSave = async (id) => {
    const fieldToSave = fields.find(field => field.id === id);
    if (!fieldToSave) return;

    const result = await saveVideo(trimmedCode, {
      videoName: fieldToSave.videoName,
      videoUrl: fieldToSave.value,
    });

    if (result.success) {
      setFields(prev =>
        prev.map(field =>
          field.id === id
            ? {
                ...field,
                id: result.data.id || id,
                isSaved: true,
              }
            : field
        )
      );
      await getAllVideos(trimmedCode);
    } else {
      alert('Failed to save video: ' + (result.message || 'Unknown error'));
    }
  };

  const handlePlay = async (id) => {
    if (WebSocket.USING_WEBSOCKET) {
      var videoPaused1 = videoPaused;
      setVideoPaused(false);
      const workDetail = {
        pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
        workType: "VIDEO",
        uniqueCode: trimmedCode,
        workId: "SETCURRENTVIDEO",
        payload: { id: id }
      };
      sendWork(workDetail);
      setVideoPaused(videoPaused1);
    } else {
      const result = await setCurrentVideofun(trimmedCode, id);
      if (result.success) {
        setFields(prev =>
          prev.map(field =>
            field.id === id
              ? { ...field, isPlaying: true }
              : { ...field, isPlaying: false }
          )
        );
      } else {
        alert('Failed to play video: ' + (result.message || 'Unknown error'));
      }
    }
  };

  const handleDelete = async (id) => {
    const isFromContext = videos.some(video => video.id === id);

    if (isFromContext) {
      const result = await deleteVideo(trimmedCode, id);
      if (!result.success) {
        alert('Failed to delete video: ' + (result.message || 'Unknown error'));
        return;
      }
      await getAllVideos(trimmedCode);
    }

    setFields(prev => prev.filter(field => field.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {fields.map(({ id, value, videoName, isPlaying, isSaved }, index) => (
        <div key={id} className="mb-3">
          <div className="flex flex-col sm:flex-row items-center">
            {isSaved ? (
              <>
                <div className="flex w-full space-x-2">
                <div
                  onClick={() => handlePlay(id)}
                  className={`w-5/8 px-3 py-2 truncate text-lg cursor-pointer rounded ${
                    id===currentVideo.id ? 'underline' : ''
                  }`}
                  title="Click to play"
                >
                  {videoName}
                </div>

                <div className="w-3/8 flex justify-end space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-3 py-2 rounded text-white bg-sky-600 hover:bg-sky-600/80"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={videoName}
                  onChange={e => handleChange(id, 'videoName', e.target.value)}
                  placeholder="Video name"
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <input
                  type="text"
                  value={value}
                  onChange={e => handleChange(id, 'value', e.target.value)}
                  placeholder="Video URL"
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSave(id)}
                    className="px-3 py-2 rounded text-white bg-sky-600/90 hover:bg-sky-600/80"
                    title="Save"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-3 py-2 rounded text-white bg-sky-600/90 hover:bg-sky-600/80"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
          {index < fields.length - 1 && <hr className="my-3 bg-sky-600/90" />}
        </div>
      ))}

      <button
        onClick={addField}
        className="mt-4 px-4 py-2 text-white rounded bg-sky-600 hover:bg-sky-600/80"
      >
        <FaPlus />
      </button>
      <div className="fixed bottom-0 left-0 w-full bg-sky-600/90 border-t shadow z-50">
        <Controller trimmedCode={trimmedCode}/>
      </div>
    </div>
  );
};

export default MobileOption2;
