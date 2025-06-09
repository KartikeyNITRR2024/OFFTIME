import React, { useRef } from "react";
import WebsocketContext from "./WebsocketContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Microservices from "../../property/Microservices";
import { toast } from "react-toastify";

export default function WebsocketState(props) {
  const clientRef = useRef(null);
  const [connected, setConnected] = React.useState(false);
  const [resultList, setResultList] = React.useState([]);

  const createConnection = (code) => {
    const trimmed = code?.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 10) {
      return { success: false, message: "Code must be between 5 and 10 characters." };
    }
    const toastId = toast.loading("Connecting to server...");

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${Microservices.OFFTIME_VIDEOPLAYER.URL}ws`),
      onConnect: () => {
        stompClient.subscribe(`/queue/${trimmed}`, (workResult) => {
          resultList.push(JSON.parse(workResult.body));
          setResultList([...resultList]);
        });
        console.log("WebSocket connection established.");
        return { success: true, message: "Connection initiated." };
      },
      onStompError: (frame) => {
        toast.update(toastId, { render: "Failed to connect with server", type: "error", isLoading: false, autoClose: 3000 });
      },
      reconnectDelay: 5000,
    });

    stompClient.activate();
    clientRef.current = stompClient;
    setConnected(true);
    toast.dismiss(toastId);
  };


  const sendWork = (workDetail) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(workDetail),
      });
    } else {
      console.warn("WebSocket not connected. Please establish connection first.");
    }
  };

  const closeConnection = () => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
      console.log("WebSocket connection closed.");
    }
  };

  return (
    <WebsocketContext.Provider
      value={{
        createConnection,
        closeConnection,
        sendWork,
        connected,
        resultList,
        setResultList
      }}
    >
      {props.children}
    </WebsocketContext.Provider>
  );
}
