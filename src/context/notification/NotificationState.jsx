import React, { useState } from "react";
import NotificationContext from "./NotificationContext";

export default function NotificationState(props) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [errorCode, setErrorCode] = useState(-1);

  const cleanAllData = () => {
    setShowNotification(false);
    setNotificationMessage("");
    setErrorCode(-1);
  };

  const showNotificationFunc = ({ error, notification }) => {
    setShowNotification(true);
    setNotificationMessage(notification);
    setErrorCode(error);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, notificationMessage, errorCode, showNotificationFunc, cleanAllData }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
}
