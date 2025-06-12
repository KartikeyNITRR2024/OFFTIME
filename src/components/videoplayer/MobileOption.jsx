import React, { useState, useEffect, useContext } from 'react';
import VideoContext from '../../context/video/VideoContext';
import WebSocketContext from '../../context/websocket/WebsocketContext';
import WebsocketState from '../../context/websocket/WebsocketState';
import WebSocket from '../../property/Websocket';
import Microservices from '../../property/Microservices';

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

const MobileOption = ({ trimmedCode }) => {
  const { videos, deleteVideo, saveVideo, setCurrentVideofun, getAllVideos } = useContext(VideoContext);
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
    var result = null;
    if(WebSocket.USING_WEBSOCKET)
    {
        const workDetail = {
          pathUniqueId: Microservices.OFFTIME_VIDEOPLAYER.ID,
          workType: "VIDEO",
          uniqueCode: trimmedCode,
          workId: "SETCURRENTVIDEO",
          payload: { id: id }
        }
        sendWork(workDetail);
    }
    else
    {
      result = await setCurrentVideofun(trimmedCode, id);
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
      <h2 className="text-xl font-semibold mb-4">Music Player</h2>

      {fields.map(({ id, value, videoName, isPlaying, isSaved }) => (
        <div
          key={id}
          className="flex flex-col sm:flex-row items-start sm:items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-2"
        >
          <input
            type="text"
            value={videoName}
            onChange={e => handleChange(id, 'videoName', e.target.value)}
            placeholder="Video name"
            disabled={isSaved}
            className="w-full sm:w-1/3 border rounded px-3 py-2 disabled:bg-gray-200"
          />
          <input
            type="text"
            value={value}
            onChange={e => handleChange(id, 'value', e.target.value)}
            placeholder="Video URL"
            disabled={isSaved}
            className="w-full sm:w-2/3 border rounded px-3 py-2 disabled:bg-gray-200"
          />

          <div className="flex space-x-1 items-center">
            {isSaved ? (
              <>
                <button
                  onClick={() => handlePlay(id)}
                  className={`px-3 py-2 rounded text-white ${
                    isPlaying ? 'bg-green-600' : 'bg-gray-600 hover:bg-green-600'
                  }`}
                  title="Play"
                >
                  ▶️
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSave(id)}
                className="px-3 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                title="Save"
              >
                💾
              </button>
            )}
            <button
              onClick={() => handleDelete(id)}
              className="px-3 py-2 rounded text-white bg-red-700 hover:bg-red-800"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addField}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Song
      </button>
    </div>
  );
};

export default MobileOption;
