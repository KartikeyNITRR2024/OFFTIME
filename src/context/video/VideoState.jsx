import React, {useEffect} from "react";
import VideoContext from "./VideoContext";
import { toast } from "react-toastify";
import WebSocketContext from "../websocket/WebsocketContext";
import Microservices from "../../property/Microservices";
import WebSocket from "../../property/Websocket";
import { startTransition } from 'react';

export default function VideoState(props) {

  const [videos, setVideos] = React.useState([]);
  const [currentVideo, setCurrentVideo] = React.useState(null);
  const { result, setResult } = React.useContext(WebSocketContext);
  const [videoPaused, setVideoPaused] = React.useState(true);
  const [playInLoop, setPlayInLoop] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [lockPlayPauseButton, setLockPlayPauseButton] = React.useState(false);

// useEffect(() => {
//   if (!WebSocket.USING_WEBSOCKET || resultList.length === 0) return;

//   setResultList((prevList) => {
//     const remainingResults = [];

//     for (const result of prevList) {
//       let handled = false;
//       const key = `${result?.timestamp}`;

//       if (processedIdsRef.current.has(key)) {
//         continue;
//       }

//       switch (result?.workId) {
//         case "SETCURRENTVIDEO":
//           setCurrentVideo(result.data);
//           handled = true;
//           break;
//         case "PLAY_PAUSE":
//           setVideoPaused(result.data);
//           handled = true;
//           break;
//         case "PLAYINLOOP":
//           setPlayInLoop(result.data);
//           handled = true;
//           break;
//         case "MUTEAUDIO":
//           setMuted(result.data);
//           handled = true;
//           break;
//         default:
//           handled = false;
//       }

//       if (handled) {
//         processedIdsRef.current.add(key);
//       } else {
//         remainingResults.push(result);
//       }
//     }
//     return remainingResults;
//   });
// }, [resultList, WebSocket.USING_WEBSOCKET]);

useEffect(() => {
  if (!result) return;

  const timeoutId = setTimeout(() => {
    let handled = false;

    switch (result?.workId) {
      case "SETCURRENTVIDEO":
        startTransition(() => setCurrentVideo(result.data));
        handled = true;
        break;
      case "PLAY_PAUSE":
        startTransition(() => setLockPlayPauseButton(false));
        startTransition(() => setVideoPaused(result.data));
        handled = true;
        break;
      case "PLAYINLOOP":
        startTransition(() => setPlayInLoop(result.data));
        handled = true;
        break;
      case "MUTEAUDIO":
        startTransition(() => setMuted(result.data));
        handled = true;
        break;
    }

    if (!handled) {
      setResult(null);
    }

    startTransition(() => setResult(null));
  }, 0);
  return () => clearTimeout(timeoutId);
}, [result]);



  const deleteVideo = async (code, id) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    if (!id) {
      return { success: false, message: "Video ID is required for deletion." };
    }

    const toastId = toast.loading("Deleting video...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();

      if (result?.success) {
        toast.update(toastId, { render: "Video deleted successfully", type: "success", isLoading: false, autoClose: 1000 });
        return { success: true, message: result.message };
      } else {
        toast.update(toastId, { render: "Failed to delete video", type: "error", isLoading: false, autoClose: 1000 });
        return { success: false, message: result.message || "Delete failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error deleting video", type: "error", isLoading: false, autoClose: 1000 });
      return { success: false, message: error.message };
    }
  };

  const setCurrentVideofun = async (code, videoId) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    if (!videoId) {
      return { success: false, message: "Video ID is required." };
    }

    const toastId = toast.loading("Setting current video...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/setCurrent`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: videoId }),
        }
      );

      const result = await response.json();

      if (result?.success) {
        setCurrentVideo(result.data);
        toast.dismiss(toastId);
        //toast.update(toastId, { render: "Current video set successfully", type: "success", isLoading: false, autoClose: 1000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to set current video", type: "error", isLoading: false, autoClose: 1000 });
        return { success: false, message: result.message || "Set current failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error setting current video", type: "error", isLoading: false, autoClose: 1000 });
      return { success: false, message: error.message };
    }
  };

  const updateVideo = async (code, videoId, lastStopTime) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    if (!videoId) {
      return { success: false, message: "Video ID is required." };
    }

    //const toastId = toast.loading("Updating video...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: videoId, lastStopTime }),
        }
      );

      const result = await response.json();

      if (result?.success) {
        //setCurrentVideo(result.data);
        //toast.update(toastId, { render: "Video updated", type: "success", isLoading: false, autoClose: 1000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to update video", type: "error", isLoading: false, autoClose: 1000 });
        return { success: false, message: result.message || "Update failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error updating video", type: "error", isLoading: false, autoClose: 1000 });
      return { success: false, message: error.message };
    }
  };

  const getAllVideos = async (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    const toastId = toast.loading("Loading videos...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/getAllVideos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        const sortedVideos = result.data.sort((a, b) => a.id - b.id);
        setVideos(sortedVideos);
        toast.dismiss(toastId);
        //toast.update(toastId, { render: "All videos loaded", type: "success", isLoading: false, autoClose: 1000 });
      } else {
        toast.update(toastId, { render: "Failed to load all videos", type: "error", isLoading: false, autoClose: 1000 });
      }
    } catch (error) {
      toast.update(toastId, { render: "Error loading all videos", type: "error", isLoading: false, autoClose: 1000 });
    }
  };

  const getCurrentVideo = async (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    const toastId = toast.loading("Loading current video...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/getCurrentVideo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        setCurrentVideo(result.data);
        toast.dismiss(toastId);
        //toast.update(toastId, { render: "Current video loaded", type: "success", isLoading: false, autoClose: 1000 });
      } else {
        toast.update(toastId, { render: "Failed to load current video", type: "error", isLoading: false, autoClose: 1000 });
      }
    } catch (error) {
      toast.update(toastId, { render: "Error loading current video", type: "error", isLoading: false, autoClose: 1000 });
    }
  };

  const saveVideo = async (code, videoData) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    if (!videoData || !videoData.videoName || !videoData.videoUrl) {
      return { success: false, message: "Both videoName and videoUrl are required." };
    }

    const toastId = toast.loading("Saving video...");

    try {
      const response = await fetch(
        `${Microservices.OFFTIME_VIDEOPLAYER.URL}api/videos/${Microservices.OFFTIME_VIDEOPLAYER.ID}/${trimmed}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        }
      );

      const result = await response.json();

      if (result?.success) {
        toast.update(toastId, { render: "Video saved successfully", type: "success", isLoading: false, autoClose: 1000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to save video", type: "error", isLoading: false, autoClose: 1000 });
        return { success: false, message: result.message || "Save failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error saving video", type: "error", isLoading: false, autoClose: 1000 });
      return { success: false, message: error.message };
    }
  };

  return (
    <VideoContext.Provider
      value={{ videos, setVideos, currentVideo, setCurrentVideo, deleteVideo, saveVideo, setCurrentVideofun, updateVideo, getAllVideos, getCurrentVideo, videoPaused, setVideoPaused, playInLoop, setPlayInLoop, muted, setMuted, lockPlayPauseButton, setLockPlayPauseButton }}
    >
      {props.children}
    </VideoContext.Provider>
  );
}
