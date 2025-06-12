import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import VideoState from "./context/video/VideoState";
import UserState from "./context/user/UserState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WebsocketState from "./context/websocket/WebsocketState";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:code" element={<Home />} />
        <Route path="/*" element={<Landing />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
}

export default function AppWrapper() {
  return (
    <WebsocketState>
      <VideoState>
        <UserState>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserState>
      </VideoState>
    </WebsocketState>
  );
}
