import React from "react";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-sky-600/90 text-white p-4">
            <div className="w-full flex justify-center mb-4 back-to-top-container">
                <button
                    onClick={scrollToTop}
                    className="font-semibold w-full px-6 py-2 hover:bg-sky-500 cursor-pointer transition"
                    aria-label="Back to top"
                >
                    Back to Top
                </button>
            </div>

            <div className="px-7 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-bold">Get to know us</h3>
                </div>
                <div>
                    <h3 className="text-lg font-bold">Help us to improve</h3>
                </div>
                <div>
                    <h3 className="text-lg font-bold">Support us</h3>
                </div>
                <div>
                    <h3 className="text-lg font-bold">More</h3>
                </div>
            </div>

            <p className="text-sm px-4 md:px-20 py-10 text-center">
                Offtime helps you manage your time and focus on what matters most. Take control of your digital life with our simple tools.
            </p>
        </footer>
    );
};

export default Footer;
