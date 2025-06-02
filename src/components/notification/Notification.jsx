import React, { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationContext from "../../context/notification/NotificationContext";

const Notification = () => {
  const { showNotification, notificationMessage, errorCode, cleanAllData } = useContext(NotificationContext);

  useEffect(() => {
    if (showNotification) {
      if (errorCode === 0) {
        toast.success(notificationMessage);
      } else if (errorCode === 1) {
        toast.error(notificationMessage);
      }
      cleanAllData();
    }
  }, [showNotification]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Notification;
