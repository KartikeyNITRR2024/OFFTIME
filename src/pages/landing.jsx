import React, { useState, useContext, useEffect, useRef } from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { useNavigate } from 'react-router-dom'; 
import UserContext from '../context/user/usercontext'; // adjust the path if needed

const Landing = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);
    const { validateCode } = useContext(UserContext);
    const navigate = useNavigate();
    const debounceTimeout = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setCode(value);
        setMessage('');
        setSuccess(null);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);


        debounceTimeout.current = setTimeout(async () => {
            if (value.trim() !== '') {
                const result = await validateCode(value.trim());
                if (!result.isValid) {
                    setSuccess(false);
                } else {
                    setSuccess(true);
                }
                setMessage(result.message);
            }
        }, 500);
    };

    const redirectPage = async () => {
        const result = await validateCode(code.trim());
        if (result.isValid) {
            navigate(`/${code.trim()}`);
        } else {
            setMessage(result.message);
            setSuccess(false);
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    return (
        <div>
            <main className="bg-sky-500/90 text-white min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-1 justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-black w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-4 text-sky-700">Welcome to Offtime!</h2>
                        <label htmlFor="unique-code" className="block text-lg font-semibold mb-2">Enter your unique code</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                id="unique-code"
                                value={code}
                                onChange={handleChange}
                                placeholder="Doreamon"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    !success
                                        ? 'border-red-500 focus:ring-red-500'
                                        : success
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:ring-sky-500'
                                }`}
                            />
                            {success && (<button
                                onClick={redirectPage}
                                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
                            >
                                Go!
                            </button>)}
                        </div>
                        {success == false && (
                            <p className="mt-3 text-sm text-red-600 flex items-center">
                                <img src="/src/assets/images/landingpage/allreadyused.png" alt="error" className="h-5 w-5 mr-2" />
                                {message}
                            </p>
                        )}
                        {success && (
                            <p className="mt-3 text-sm text-green-600 flex items-center">
                                <img src="/src/assets/images/landingpage/right.png" alt="success" className="h-5 w-5 mr-2" />
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
