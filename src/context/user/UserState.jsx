import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import UserContext from "./UserContext";
import VideoContext from "../video/VideoContext";
import Microservices from "../../property/Microservices";

export default function UserState(props) {
  const { setVideos, setCurrentVideo } = useContext(VideoContext);
  const [loading, setLoading] = useState(false);

  const validateCode = async (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      toast.error("Code must be between 5 and 10 characters.");
      return { isValid: false, message: "Code must be between 5 and 10 characters." };
    }

    try {
      setLoading(true);
      const response = await fetch(`${Microservices.OFFTIME_VIDEOPLAYER.URL}api/users/${Microservices.OFFTIME_VIDEOPLAYER.ID}/exists/${trimmed}`);
      const result = await response.json();
      setLoading(false);

      if (result?.data === true) {
        toast.success("Code is already taken but you can use it.");
        return { isValid: true, moveForward: true, message: "Code is already taken but you can use it." };
      }

      toast.success("Code is not taken.");
      return { isValid: true, message: "Code is not taken." };
    } catch (error) {
      setLoading(false);
      console.error("Error validating code:", error);
      toast.error("Failed to validate code. Try again.");
      return { isValid: false, message: "Failed to validate code. Try again." };
    }
  };

  const createOrUpdateCode = async (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      toast.error("Code must be between 5 and 10 characters.");
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    try {
      setLoading(true);
      const response = await fetch(`${Microservices.OFFTIME_VIDEOPLAYER.URL}api/users/${Microservices.OFFTIME_VIDEOPLAYER.ID}/createOrUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uniqueCode: trimmed })
      });

      const result = await response.json();
      setLoading(false);

      if (result?.success) {
        setVideos(result.data.videos || []);
        setCurrentVideo(result.data.currentVideo || null);
        toast.success("User updated successfully.");
        return { success: true };
      } else {
        toast.error("Failed to update user.");
        console.error("Failed to create or update user:", result);
        return { success: false };
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
      console.error("Error calling createOrUpdate:", error);
      return { success: false };
    }
  };

  return (
    <UserContext.Provider
      value={{
        validateCode,
        createOrUpdateCode,
        loading
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
