const isLive = import.meta.env.VITE_ISLIVE === "1";

const Microservices = {
  OFFTIME_VIDEOPLAYER: {
    URL: isLive 
      ? import.meta.env.VITE_OFFTIME_VIDEOPLAYER_URL 
      : import.meta.env.VITE_OFFTIME_VIDEOPLAYER_URL_LOCAL,
    ID: import.meta.env.VITE_OFFTIME_VIDEOPLAYER_KEY,
  },
};

export default Microservices;