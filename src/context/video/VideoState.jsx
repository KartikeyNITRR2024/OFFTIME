import React from "react";
import VideoContext from "./VideoContext";
import { toast } from "react-toastify";
import Microservices from "../../property/Microservices";

export default function VideoState(props) {

  const [videos, setVideos] = React.useState([]);
  const [currentVideo, setCurrentVideo] = React.useState(null);

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
        toast.update(toastId, { render: "Video deleted successfully", type: "success", isLoading: false, autoClose: 3000 });
        return { success: true, message: result.message };
      } else {
        toast.update(toastId, { render: "Failed to delete video", type: "error", isLoading: false, autoClose: 3000 });
        return { success: false, message: result.message || "Delete failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error deleting video", type: "error", isLoading: false, autoClose: 3000 });
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
        toast.update(toastId, { render: "Current video set successfully", type: "success", isLoading: false, autoClose: 3000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to set current video", type: "error", isLoading: false, autoClose: 3000 });
        return { success: false, message: result.message || "Set current failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error setting current video", type: "error", isLoading: false, autoClose: 3000 });
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

    const toastId = toast.loading("Updating video...");

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
        setCurrentVideo(result.data);
        toast.update(toastId, { render: "Video updated", type: "success", isLoading: false, autoClose: 3000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to update video", type: "error", isLoading: false, autoClose: 3000 });
        return { success: false, message: result.message || "Update failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error updating video", type: "error", isLoading: false, autoClose: 3000 });
      return { success: false, message: error.message };
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
        toast.update(toastId, { render: "Video saved successfully", type: "success", isLoading: false, autoClose: 3000 });
        return { success: true, data: result.data };
      } else {
        toast.update(toastId, { render: "Failed to save video", type: "error", isLoading: false, autoClose: 3000 });
        return { success: false, message: result.message || "Save failed." };
      }
    } catch (error) {
      toast.update(toastId, { render: "Error saving video", type: "error", isLoading: false, autoClose: 3000 });
      return { success: false, message: error.message };
    }
  };

  return (
    <VideoContext.Provider
      value={{ videos, setVideos, currentVideo, setCurrentVideo, deleteVideo, saveVideo, setCurrentVideofun, updateVideo }}
    >
      {props.children}
    </VideoContext.Provider>
  );
}
