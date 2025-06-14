import React, { useRef, useEffect, useState } from "react";
import WebsocketContext from "./WebsocketContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Microservices from "../../property/Microservices";
import { toast } from "react-toastify";

function useUpdateTimerCheck(updateTimerResult, setIsPlayerConnected) {
  const updateTimerResultRef = useRef(null);

  useEffect(() => {
    updateTimerResultRef.current = updateTimerResult;
  }, [updateTimerResult]);

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = updateTimerResultRef.current;
      if (latest) {
        const now = new Date();
        const refTime = new Date(latest);
        const diffInSeconds = Math.abs((now - refTime) / 1000);
        console.log("hello 2", refTime," ",refTime);
        if (diffInSeconds < 6) {
          console.log("hello 3 less then 6");
          setIsPlayerConnected(true);
        } else {
          console.log("hello 3 not less then 6");
          setIsPlayerConnected(false);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);
}

export default function WebsocketState(props) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [result, setResult] = useState();
  const [updateTimerResult, setUpdateTimerResult] = useState();
  const [isPlayerConnected, setIsPlayerConnected] = useState(false);

  useUpdateTimerCheck(updateTimerResult, setIsPlayerConnected);

  const createConnection = (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }

    const toastId = toast.loading("Connecting to server...");

    if (clientRef.current && clientRef.current.connected) {
      console.log("Already connected.");
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${Microservices.OFFTIME_VIDEOPLAYER.URL}ws`),
      onConnect: () => {
        stompClient.subscribe(`/queue/${trimmed}`, (workResult) => {
          const result = JSON.parse(workResult.body);

          if (result.workId === "ISPLAYING") {
            const dateObject = new Date(result.timestamp);
                        console.log("hello 1", dateObject);
            setUpdateTimerResult(dateObject);
          } else {
            setResult(result);
          }
        });

        console.log("✅ WebSocket connection established.");
        toast.update(toastId, { render: "Connected to server", type: "success", isLoading: false, autoClose: 1000 });
        setConnected(true);
      },
      onStompError: () => {
        toast.update(toastId, { render: "❌ Failed to connect to server", type: "error", isLoading: false, autoClose: 1000 });
      },
      reconnectDelay: 5000,
    });

    stompClient.activate();
    clientRef.current = stompClient;
  };

  const sendWork = (workDetail) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(workDetail),
      });
    } else {
      console.warn("WebSocket not connected. Please connect first.");
    }
  };

  const closeConnection = () => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
      console.log("🔌 WebSocket connection closed.");
    }
  };

  return (
    <WebsocketContext.Provider
      value={{
        createConnection,
        closeConnection,
        sendWork,
        connected,
        result,
        setResult,
        isPlayerConnected
      }}
    >
      {props.children}
    </WebsocketContext.Provider>
  );
}
