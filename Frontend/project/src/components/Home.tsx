import React, { useState, useEffect } from 'react';
import Helmet from "./Helemt/Helmet";
import Header from './Header'; // Import the Header component
import heroimg1 from "./assets/header_img.png";

const Home: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <Header isLoggedIn={false} onLogout={() => { }} /> {/* Fixed Header */}
            <Helmet title={"Home"}>
                <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 pt-24"> {/* Increased top padding to account for fixed header */}
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Left Column - Content */}
                            <div className={`w-full md:w-1/2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        Revolutionary Clinical Support System
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        AIsculapius
                                    </h2>

                                    <p className="text-lg text-gray-700 mt-6 mb-8">
                                        Empower your medical decisions with advanced AI technology that delivers accurate
                                        diagnoses and personalized treatment plans. Enhance your practice, save time, and
                                        improve patient outcomes today.
                                    </p>

                                    <div className="flex space-x-4">
                                        <a
                                            href="#events"
                                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                                        >
                                            Get Started
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
                                        </a>
                                        <a
                                            href="#demo"
                                            className="px-8 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                                        >
                                            Watch Demo
                                        </a>
                                    </div>

                                    <div className="flex mt-8 space-x-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-400"></div>
                                            <div className="w-10 h-10 rounded-full bg-indigo-400"></div>
                                            <div className="w-10 h-10 rounded-full bg-purple-400"></div>
                                        </div>
                                        <p className="text-gray-600 ml-2">Trusted by 1000+ healthcare providers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image */}
                            <div className={`w-full md:w-1/2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                    <img
                                        src={heroimg1}
                                        alt="AI Medical Assistant"
                                        className="relative z-10 w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section Preview */}
                    <div className="container mx-auto px-4 mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['Accurate Diagnosis', 'Treatment Plans', 'Patient Monitoring'].map((feature, index) => (
                                <div
                                    key={index}
                                    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                        }`}
                                    style={{ transitionDelay: `${index * 200 + 500}ms` }}
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature}</h3>
                                    <p className="text-gray-600">
                                        Leverage advanced AI technology to improve clinical outcomes and patient care.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Helmet>
        </>
    );
};

export default Home;