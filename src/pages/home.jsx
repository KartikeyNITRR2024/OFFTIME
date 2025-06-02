import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import VideoPlayerMain from '../components/videoplayer/videoplayermain';
import Notification from '../components/notification/notification';

const Home = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const trimmedCode = code?.trim();

    useEffect(() => {
        if (!trimmedCode || trimmedCode.length < 5 || trimmedCode.length > 10) {
            navigate('/');
        }
    }, [trimmedCode, navigate]);

    return (
        <div>
            <main className="bg-sky-500/90 text-white min-h-screen flex flex-col">
                <Header />
                <Notification/>
                <VideoPlayerMain trimmedCode={trimmedCode} />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
