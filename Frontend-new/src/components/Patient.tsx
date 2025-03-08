import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    HeartPulse,
    FileText,
    Clock,
    Bookmark,
    Shield,
    BadgeInfo,
    MessageSquare
} from 'lucide-react';
import Chat from './Chat'; // Import Chat component

interface PatientData {
    _id: string;
    name: string;
    gender: string;
    condition: string;
    description: string;
    age: number;
    symptoms: string;
    medications: string;
    allergies: string;
    personalHistory: string;
    familyHistory: string;
    remarks: string;
}

interface PatientProps {
    isDarkMode: boolean;
    patient: PatientData;
}

const Patient: React.FC<PatientProps> = ({ isDarkMode, patient: initialPatient }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [patientData, setPatientData] = useState<PatientData | null>(initialPatient);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialPatient) {
            setPatientData(initialPatient);
        }
    }, [initialPatient]);

    const handleChatClick = () => {
        setActiveTab('chat');
    };

    const getConditionColor = () => {
        const conditionMap: Record<string, string> = {
            "Critical": isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800",
            "Stable": isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800",
            "Improving": isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800",
            "Recovering": isDarkMode ? "bg-teal-900 text-teal-300" : "bg-teal-100 text-teal-800"
        };

        return patientData?.condition && conditionMap[patientData.condition] ?
            conditionMap[patientData.condition] :
            (isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800");
    };

    return (
        <div className={`min-h-screen pb-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`mt-6 rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`py-10 px-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className={`flex items-center justify-center h-16 w-16 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} mr-4`}>
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {patientData?.name || 'Patient Details'}
                                    </h1>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Patient ID: {patientData?._id.substring(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getConditionColor()}`}>
                                    {patientData?.condition}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center py-4 px-6 font-medium transition-colors duration-200 ${activeTab === 'overview' ? (isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
                        >
                            <BadgeInfo className="h-5 w-5 mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`flex items-center py-4 px-6 font-medium transition-colors duration-200 ${activeTab === 'medical' ? (isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
                        >
                            <HeartPulse className="h-5 w-5 mr-2" />
                            Medical Info
                        </button>
                        <button
                            onClick={handleChatClick}
                            className={`flex items-center py-4 px-6 font-medium transition-colors duration-200 ${activeTab === 'chat' ? (isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
                        >
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Chat
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`col-span-1 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                                <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    <User className="h-5 w-5 mr-2" />
                                    Personal Information
                                </h2>
                                <div className="space-y-4">
                                    <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{patientData?.name}</p>
                                    </div>
                                    <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{patientData?.gender}</p>
                                    </div>
                                    <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient ID</p>
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{patientData?._id}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-span-2 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                                <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    <Bookmark className="h-5 w-5 mr-2" />
                                    Patient Summary
                                </h2>
                                <div className={`mb-6 rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center mb-2">
                                        <HeartPulse className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Current Condition</h3>
                                    </div>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{patientData?.condition}</p>
                                </div>
                                <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center mb-2">
                                        <FileText className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Description</h3>
                                    </div>
                                    <p className={`whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{patientData?.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'medical' && (
                        <div className={`rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                            <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                <Shield className="h-5 w-5 mr-2" />
                                Medical Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center mb-4">
                                        <HeartPulse className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Condition Status</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Current medical condition</p>
                                        </div>
                                    </div>
                                    <div className={`mt-2 py-2 px-4 rounded-md ${getConditionColor()}`}>
                                        <span className="font-semibold">{patientData?.condition}</span>
                                    </div>
                                </div>
                                <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center mb-4">
                                        <Clock className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Last Updated</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Most recent record update</p>
                                        </div>
                                    </div>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className={`rounded-lg p-6 col-span-1 md:col-span-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-start mb-4">
                                        <FileText className={`h-6 w-6 mr-3 mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Medical Description</h3>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Detailed information</p>
                                        </div>
                                    </div>
                                    <div className={`mt-2 p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <p className={`whitespace-pre-line leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{patientData?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <Chat isDarkMode={isDarkMode} patientId={patientData?._id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Patient;