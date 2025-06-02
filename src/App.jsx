import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Home from "./pages/home";
import UserState from "./context/user/userstate.jsx";
import VideoState from "./context/video/videostate";
import NotificationState from "./context/notification/notificationstate";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/:code" element={<Home />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <NotificationState>
      <VideoState>
        <UserState>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserState>
      </VideoState> 
    </NotificationState>                         
  );
}
