// pages/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import VideoPlayerMain from '../components/videoplayer/VideoPlayerMain';

const Home = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('name')?.trim();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code || code.length < 5 || code.length > 10) {
      navigate('/');
    }
  }, [code, navigate]);

  return (
    <div>
      <main className="bg-sky-500/90 text-white min-h-screen flex flex-col">
        <Header />
        <VideoPlayerMain trimmedCode={code} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
