import React, { useContext } from 'react';
import { CiMusicNote1 } from 'react-icons/ci';
import VideoContext from '../../context/video/VideoContext';

export default function SongPlayingIcon() {
  const { videoPaused } = useContext(VideoContext);

  return (
    <>
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <CiMusicNote1
        className="text-white text-3xl"
        style={{
          animation: videoPaused ? 'spinSlow 2s linear infinite' : 'none',
        }}
      />
    </>
  );
}
