import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import VideoState from "./context/video/VideoState";
import NotificationState from "./context/notification/NotificationState";
import UserState from "./context/user/UserState";

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
