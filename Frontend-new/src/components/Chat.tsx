// import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';

// interface Message {
//     id: string;
//     text: string;
//     sender: 'user' | 'patient';
//     timestamp: Date;
// }

// interface ChatProps {
//     isDarkMode: boolean;
//     patientId: string;
// }

// const Chat: React.FC<ChatProps> = ({ isDarkMode, patientId }) => {
//     const [question, setQuestion] = useState('');
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLTextAreaElement>(null);

//     // Auto-scroll to bottom when messages change
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Focus input on component mount
//     useEffect(() => {
//         inputRef.current?.focus();
//     }, []);

//     const handleSendQuestion = async () => {
//         if (!question.trim()) return;

//         // Add user message to conversation
//         const userMessage: Message = {
//             id: Date.now().toString(),
//             text: question,
//             sender: 'user',
//             timestamp: new Date()
//         };

//         setMessages(prevMessages => [...prevMessages, userMessage]);
//         setIsLoading(true);

//         try {
//             const response = await fetch(
//                 `http://localhost:8000/query_patient/?question=${encodeURIComponent(question)}&patient_id=${patientId}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
//                     }
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();

//                 // Add patient response to conversation
//                 const patientMessage: Message = {
//                     id: (Date.now() + 1).toString(),
//                     text: formatResponse(data),
//                     sender: 'patient',
//                     timestamp: new Date()
//                 };

//                 setMessages(prevMessages => [...prevMessages, patientMessage]);
//             } else {
//                 // Add error message if request fails
//                 const errorMessage: Message = {
//                     id: (Date.now() + 1).toString(),
//                     text: "Sorry, I couldn't process your question. Please try again.",
//                     sender: 'patient',
//                     timestamp: new Date()
//                 };

//                 setMessages(prevMessages => [...prevMessages, errorMessage]);
//                 console.error('Failed to query patient AI:', response.status, response.statusText);
//             }
//         } catch (error) {
//             // Add error message if request throws an exception
//             const errorMessage: Message = {
//                 id: (Date.now() + 1).toString(),
//                 text: "Sorry, there was an error connecting to the server. Please try again later.",
//                 sender: 'patient',
//                 timestamp: new Date()
//             };

//             setMessages(prevMessages => [...prevMessages, errorMessage]);
//             console.error('Error querying patient AI:', error);
//         } finally {
//             setIsLoading(false);
//             setQuestion('');
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendQuestion();
//         }
//     };

//     const formatTime = (date: Date): string => {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const formatResponse = (data: any): string => {
//         if (!data) return "No response available.";

//         // Ensure `data.response` is a string
//         const rawResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response);

//         const patientInfo = `### Patient Information
// 🧑 **Name:** ${data.patient_info?.name || 'N/A'}
// 📅 **Age:** ${data.patient_info?.age || 'N/A'}
// ⚧ **Gender:** ${data.patient_info?.gender || 'N/A'}
// 🏥 **Condition:** ${data.patient_info?.condition || 'N/A'}
// 🤒 **Symptoms:** ${data.patient_info?.symptoms || 'N/A'}
// 💊 **Medications:** ${data.patient_info?.medications || 'N/A'}
// ⚠️ **Allergies:** ${data.patient_info?.allergies || 'None'}
// 📝 **Personal History:** ${data.patient_info?.personalHistory || 'N/A'}
// 👪 **Family History:** ${data.patient_info?.familyHistory || 'N/A'}
// 📋 **Remarks:** ${data.patient_info?.remarks || 'N/A'}`;

//         const formattedResponse = rawResponse
//             .replace(/\*\*Medication Adjustment\*\*/g, '💊 **Medication Adjustment**')
//             .replace(/\*\*Therapeutic Interventions\*\*/g, '🔄 **Therapeutic Interventions**')
//             .replace(/\*\*Monitoring Parameters\*\*/g, '📊 **Monitoring Parameters**')
//             .replace(/\*\*Disease Severity Assessment\*\*/g, '📈 **Disease Severity Assessment**')
//             .replace(/\*\*Response:\*\*/g, '### Medical Assessment')
//             .replace(/\n\n/g, '\n')  // Remove extra newlines
//             .replace(/- /g, '• ');    // Replace dashes with bullets

//         const confidence = data.confidence_score || 0;
//         const confidenceEmoji = confidence > 4 ? '🟢' : confidence > 2.5 ? '🟡' : '🔴';
//         const confidenceScore = `\n\n${confidenceEmoji} **Confidence Score:** ${confidence.toFixed(2)}`;

//         return `${patientInfo}\n\n${formattedResponse}${confidenceScore}`.replace(/\n/g, '  \n');
//     };


//     // Add welcome message if conversation is empty
//     useEffect(() => {
//         if (messages.length === 0) {
//             setMessages([
//                 {
//                     id: 'welcome',
//                     text: "Hello! I'm your patient AI assistant. How can I help you today?",
//                     sender: 'patient',
//                     timestamp: new Date()
//                 }
//             ]);
//         }
//     }, []);

//     return (
//         <div className={`min-h-screen pb-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//             <div className="max-w-7xl mx-auto px-6">
//                 <div className={`mt-6 rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                     {/* Header */}
//                     <div className={`py-6 px-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
//                                     Patient AI Assistant
//                                 </h1>
//                                 <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                     Patient ID: {patientId || 'Unknown'}
//                                 </p>
//                             </div>
//                             <div className={`flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
//                                 <div className="w-3 h-3 rounded-full bg-current mr-2"></div>
//                                 <span className="text-sm font-medium">Active</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Chat conversation area */}
//                     <div className={`p-6 overflow-y-auto h-96 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//                         {messages.map((message) => (
//                             <div
//                                 key={message.id}
//                                 className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                             >
//                                 <div
//                                     className={`max-w-3/4 rounded-lg px-4 py-2 ${message.sender === 'user'
//                                         ? isDarkMode
//                                             ? 'bg-blue-600 text-white'
//                                             : 'bg-blue-500 text-white'
//                                         : isDarkMode
//                                             ? 'bg-gray-700 text-gray-200'
//                                             : 'bg-white text-gray-800 border border-gray-200'
//                                         }`}
//                                 >
//                                     <ReactMarkdown
//                                         remarkPlugins={[remarkGfm]}
//                                         rehypePlugins={[rehypeRaw]}
//                                         components={{
//                                             h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
//                                             strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
//                                             ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
//                                             li: ({ node, ...props }) => <li className="mb-1" {...props} />,
//                                         }}
//                                     >
//                                         {message.text}
//                                     </ReactMarkdown>
//                                     <p
//                                         className={`text-xs mt-1 text-right ${message.sender === 'user'
//                                             ? 'text-blue-100'
//                                             : isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                                             }`}
//                                     >
//                                         {formatTime(message.timestamp)}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}

//                         {isLoading && (
//                             <div className="flex justify-start mb-4">
//                                 <div
//                                     className={`rounded-lg px-4 py-2 ${isDarkMode
//                                         ? 'bg-gray-700 text-gray-200'
//                                         : 'bg-white text-gray-800 border border-gray-200'
//                                         }`}
//                                 >
//                                     <div className="flex space-x-1">
//                                         <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
//                                         <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                                         <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         <div ref={messagesEndRef} />
//                     </div>

//                     {/* Input area */}
//                     <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                         <div className="flex items-end space-x-2">
//                             <textarea
//                                 ref={inputRef}
//                                 value={question}
//                                 onChange={(e) => setQuestion(e.target.value)}
//                                 onKeyDown={handleKeyDown}
//                                 placeholder="Type your question here..."
//                                 className={`flex-grow p-3 rounded-lg resize-none focus:outline-none min-h-24 ${isDarkMode
//                                     ? 'bg-gray-700 text-gray-100 placeholder-gray-400'
//                                     : 'bg-gray-100 text-gray-900 placeholder-gray-500'
//                                     }`}
//                                 rows={3}
//                             />
//                             <button
//                                 onClick={handleSendQuestion}
//                                 disabled={isLoading || !question.trim()}
//                                 className={`p-3 rounded-lg h-12 w-12 flex items-center justify-center ${isLoading || !question.trim()
//                                     ? isDarkMode
//                                         ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                     : isDarkMode
//                                         ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                                         : 'bg-blue-500 hover:bg-blue-600 text-white'
//                                     }`}
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                                 </svg>
//                             </button>
//                         </div>
//                         <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                             Press Enter to send, Shift+Enter for new line
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Chat;
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'patient';
    timestamp: Date;
}

interface PatientInfo {
    name: string;
    age: number;
    gender: string;
    condition: string;
    symptoms: string;
    medications: string;
    allergies: string;
    personalHistory: string;
    familyHistory: string;
    remarks: string;
    Email?: string;
    score?: string;
    latest_risk_factor?: string;
}

interface ResponseData {
    query: string;
    patient_info: PatientInfo;
    response: string[] | string;
    confidence_score?: number;
}

interface ChatProps {
    isDarkMode: boolean;
    patientId: string;
}

const Chat: React.FC<ChatProps> = ({ isDarkMode, patientId }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        patientInfo: true,
        medicalAssessment: true
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on component mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const toggleSection = (messageId: string, section: string) => {
        const key = `${messageId}-${section}`;
        setExpandedSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isSectionExpanded = (messageId: string, section: string) => {
        const key = `${messageId}-${section}`;
        return expandedSections[key] !== false; // Default to expanded if not set
    };

    const handleSendQuestion = async () => {
        if (!question.trim()) return;

        // Add user message to conversation
        const userMessage: Message = {
            id: Date.now().toString(),
            text: question,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8000/query_patient/?question=${encodeURIComponent(question)}&patient_id=${patientId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                }
            );

            if (response.ok) {
                const data: ResponseData = await response.json();

                // Add patient response to conversation
                const patientMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: formatResponse(data, (Date.now() + 1).toString()),
                    sender: 'patient',
                    timestamp: new Date()
                };

                setMessages(prevMessages => [...prevMessages, patientMessage]);
            } else {
                // Add error message if request fails
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Sorry, I couldn't process your question. Please try again.",
                    sender: 'patient',
                    timestamp: new Date()
                };

                setMessages(prevMessages => [...prevMessages, errorMessage]);
                console.error('Failed to query patient AI:', response.status, response.statusText);
            }
        } catch (error) {
            // Add error message if request throws an exception
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, there was an error connecting to the server. Please try again later.",
                sender: 'patient',
                timestamp: new Date()
            };

            setMessages(prevMessages => [...prevMessages, errorMessage]);
            console.error('Error querying patient AI:', error);
        } finally {
            setIsLoading(false);
            setQuestion('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendQuestion();
        }
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const parsePatientInfoFromText = (text: string): PatientInfo | null => {
        try {
            if (text.includes('**Name:**') && text.includes('**Age:**')) {
                const name = text.match(/\*\*Name:\*\*\s*([^\n]+?)(?=\s+\*\*Age)/)?.[1] || 'N/A';
                const age = parseInt(text.match(/\*\*Age:\*\*\s*(\d+)/)?.[1] || '0');
                const gender = text.match(/\*\*Gender:\*\*\s*([^\n]+?)(?=\s+\*\*Condition)/)?.[1] || 'N/A';
                const condition = text.match(/\*\*Condition:\*\*\s*([^\n]+?)(?=\s+\*\*Symptoms)/)?.[1] || 'N/A';
                const symptoms = text.match(/\*\*Symptoms:\*\*\s*([^\n]+?)(?=\s+\*\*Medications)/)?.[1] || 'N/A';
                const medications = text.match(/\*\*Medications:\*\*\s*([^\n]+?)(?=\s+\*\*Allergies)/)?.[1] || 'N/A';
                const allergies = text.match(/\*\*Allergies:\*\*\s*([^\n]+?)(?=\s+\*\*Personal History)/)?.[1] || 'N/A';
                const personalHistory = text.match(/\*\*Personal History:\*\*\s*([^\n]+?)(?=\s+\*\*Family History)/)?.[1] || 'N/A';
                const familyHistory = text.match(/\*\*Family History:\*\*\s*([^\n]+?)(?=\s+\*\*Remarks)/)?.[1] || 'N/A';
                const remarks = text.match(/\*\*Remarks:\*\*\s*([^\n]+?)(?=$|\n)/)?.[1] || 'N/A';

                return {
                    name,
                    age,
                    gender,
                    condition,
                    symptoms,
                    medications,
                    allergies,
                    personalHistory,
                    familyHistory,
                    remarks
                };
            }
            return null;
        } catch (error) {
            console.error("Error parsing patient info from text:", error);
            return null;
        }
    };

    const formatResponse = (data: ResponseData | string, messageId: string): string => {
        // If input is a string, try to parse patient info from it
        if (typeof data === 'string') {
            const patientInfo = parsePatientInfoFromText(data);
            if (patientInfo) {
                return formatStructuredPatientData(patientInfo, "", messageId);
            }
            return data; // Return as is if we couldn't parse it
        }

        if (!data) return "No response available.";

        let responseText = "";
        let severityLevel = "";

        // Handle response if it's an array
        if (Array.isArray(data.response)) {
            // Take the first element as the main response text
            responseText = data.response[0] || "";

            // If there's a second element, use it for severity
            if (data.response.length > 1) {
                severityLevel = data.response[1];
            }
        } else {
            responseText = data.response;
        }

        return formatStructuredPatientData(data.patient_info, responseText, messageId, severityLevel, data.confidence_score);
    };

    const formatStructuredPatientData = (
        patientInfo: PatientInfo,
        responseText: string,
        messageId: string,
        severityLevel: string = "",
        confidenceScore?: number
    ): string => {
        // Create collapsible patient info section
        const patientInfoSection = `<div class="section-header" data-message-id="${messageId}" data-section="patientInfo">
            <span class="toggle-icon">${isSectionExpanded(messageId, 'patientInfo') ? '▼' : '►'}</span> 
            <span class="section-title">Patient Information</span>
        </div>
        ${isSectionExpanded(messageId, 'patientInfo') ? `<div class="section-content patient-info">
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-icon">🧑</span>
                    <span class="info-label">Name:</span>
                    <span class="info-value">${patientInfo?.name || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">📅</span>
                    <span class="info-label">Age:</span>
                    <span class="info-value">${patientInfo?.age || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">⚧</span>
                    <span class="info-label">Gender:</span>
                    <span class="info-value">${patientInfo?.gender || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🏥</span>
                    <span class="info-label">Condition:</span>
                    <span class="info-value">${patientInfo?.condition || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🤒</span>
                    <span class="info-label">Symptoms:</span>
                    <span class="info-value">${patientInfo?.symptoms || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">💊</span>
                    <span class="info-label">Medications:</span>
                    <span class="info-value">${patientInfo?.medications || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">⚠️</span>
                    <span class="info-label">Allergies:</span>
                    <span class="info-value">${patientInfo?.allergies || 'None'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">📝</span>
                    <span class="info-label">Personal History:</span>
                    <span class="info-value">${patientInfo?.personalHistory || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">👪</span>
                    <span class="info-label">Family History:</span>
                    <span class="info-value">${patientInfo?.familyHistory || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">📋</span>
                    <span class="info-label">Remarks:</span>
                    <span class="info-value">${patientInfo?.remarks || 'N/A'}</span>
                </div>
            </div>
        </div>` : ''}`;

        // If there's no response text, just return the patient info
        if (!responseText) {
            return patientInfoSection;
        }

        // Clean up and format the response text
        const cleanedResponse = responseText
            // Replace markdown headers with better formatting
            .replace(/^#{1,6}\s+(.+)$/gm, (_, title) => `<div class="response-section-title">${title}</div>`)
            // Format bullet points
            .replace(/^[•*-]\s+(.+)$/gm, (_, content) => `<div class="response-bullet"><span class="bullet-point">•</span>${content}</div>`)
            // Format key items with emojis
            .replace(/\*\*(Medications?|Antibiotics?|Inhalers?|New Medication):\*\*/g, '💊 **$1:**')
            .replace(/\*\*(Therapeutic Interventions?|Oxygen Therapy|Physical Therapy|Hydration):\*\*/g, '🔄 **$1:**')
            .replace(/\*\*(Monitoring Parameters?|Temperature|Oxygen Saturation|Blood Pressure|Follow-Up):\*\*/g, '📊 **$1:**')
            .replace(/\*\*(Disease Severity|Current Symptoms|Patient's Current Condition):\*\*/g, '📈 **$1:**')
            .replace(/\*\*(Citations and Referencing):\*\*/g, '📚 **$1:**');

        // Create collapsible medical assessment section
        const medicalAssessmentSection = `<div class="section-header" data-message-id="${messageId}" data-section="medicalAssessment">
            <span class="toggle-icon">${isSectionExpanded(messageId, 'medicalAssessment') ? '▼' : '►'}</span> 
            <span class="section-title">Medical Assessment</span>
            ${severityLevel ? `<span class="severity-badge ${severityLevel.toLowerCase()}">${severityLevel}</span>` : ''}
        </div>
        ${isSectionExpanded(messageId, 'medicalAssessment') ? `<div class="section-content medical-assessment">
            ${cleanedResponse}
        </div>` : ''}`;

        // Add confidence score if available
        const confidenceSection = confidenceScore !== undefined
            ? `<div class="confidence-score">
                <span class="confidence-icon">${getConfidenceEmoji(confidenceScore)}</span>
                <span class="confidence-label">Confidence Score:</span>
                <span class="confidence-value">${confidenceScore.toFixed(2)}</span>
              </div>`
            : '';

        return `${patientInfoSection}\n\n${medicalAssessmentSection}\n\n${confidenceSection}`;
    };

    const getSeverityEmoji = (severity: string): string => {
        switch (severity.toLowerCase()) {
            case 'critical': return '🔴';
            case 'severe': return '🟠';
            case 'moderate': return '🟡';
            case 'mild': return '🟢';
            default: return '⚪';
        }
    };

    const getConfidenceEmoji = (score: number): string => {
        return score > 4 ? '🟢' : score > 2.5 ? '🟡' : '🔴';
    };

    // Add welcome message if conversation is empty
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    text: "Hello! I'm your patient AI assistant. How can I help you today?",
                    sender: 'patient',
                    timestamp: new Date()
                }
            ]);
        }
    }, []);

    // Handle section toggle clicks
    useEffect(() => {
        const handleSectionToggle = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.section-header')) {
                const header = target.closest('.section-header') as HTMLElement;
                const messageId = header.getAttribute('data-message-id');
                const section = header.getAttribute('data-section');

                if (messageId && section) {
                    toggleSection(messageId, section);
                }
            }
        };

        document.addEventListener('click', handleSectionToggle);
        return () => {
            document.removeEventListener('click', handleSectionToggle);
        };
    }, []);

    const chatContainerStyle = isDarkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gray-50 text-gray-900';

    const messageBubbleStyle = (sender: 'user' | 'patient') => {
        if (sender === 'user') {
            return isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white';
        } else {
            return isDarkMode
                ? 'bg-gray-700 text-gray-200'
                : 'bg-white text-gray-800 border border-gray-200';
        }
    };

    return (
        <div className={`min-h-screen pb-12 ${chatContainerStyle}`}>
            <div className="max-w-7xl mx-auto px-6">
                <style jsx global>{`
                    .section-header {
                        cursor: pointer;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        padding: 8px 12px;
                        border-radius: 6px;
                        background-color: ${isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(243, 244, 246, 0.8)'};
                    }
                    .section-header:hover {
                        background-color: ${isDarkMode ? 'rgba(75, 85, 99, 0.8)' : 'rgba(229, 231, 235, 0.8)'};
                    }
                    .toggle-icon {
                        margin-right: 8px;
                        font-size: 10px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .section-content {
                        padding: 12px;
                        margin-bottom: 16px;
                        border-left: 3px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'};
                        padding-left: 16px;
                        border-radius: 0 6px 6px 0;
                        background-color: ${isDarkMode ? 'rgba(31, 41, 55, 0.3)' : 'rgba(249, 250, 251, 0.8)'};
                    }
                    
                    /* Patient info grid styling */
                    .patient-info .info-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 10px;
                    }
                    .patient-info .info-item {
                        display: flex;
                        align-items: baseline;
                        padding: 4px 0;
                    }
                    .patient-info .info-icon {
                        margin-right: 6px;
                        font-size: 14px;
                    }
                    .patient-info .info-label {
                        font-weight: 600;
                        margin-right: 6px;
                        color: ${isDarkMode ? 'rgba(209, 213, 219, 0.9)' : 'rgba(55, 65, 81, 0.9)'};
                    }
                    .patient-info .info-value {
                        color: ${isDarkMode ? 'rgba(243, 244, 246, 1.0)' : 'rgba(17, 24, 39, 1.0)'};
                    }
                    
                    /* Medical assessment styling */
                    .medical-assessment {
                        line-height: 1.6;
                    }
                    .medical-assessment .response-section-title {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 16px 0 12px 0;
                        padding-bottom: 4px;
                        border-bottom: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.8)'};
                        color: ${isDarkMode ? 'rgba(243, 244, 246, 1.0)' : 'rgba(17, 24, 39, 1.0)'};
                    }
                    .medical-assessment .response-section-title:first-child {
                        margin-top: 0;
                    }
                    .medical-assessment .response-bullet {
                        display: flex;
                        margin-bottom: 6px;
                        padding-left: 8px;
                    }
                    .medical-assessment .bullet-point {
                        margin-right: 8px;
                        color: ${isDarkMode ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.8)'};
                    }
                    
                    /* Severity badge */
                    .severity-badge {
                        margin-left: auto;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .severity-badge.critical {
                        background-color: rgba(239, 68, 68, 0.2);
                        color: rgb(239, 68, 68);
                    }
                    .severity-badge.severe {
                        background-color: rgba(249, 115, 22, 0.2);
                        color: rgb(249, 115, 22);
                    }
                    .severity-badge.moderate {
                        background-color: rgba(245, 158, 11, 0.2);
                        color: rgb(245, 158, 11);
                    }
                    .severity-badge.mild {
                        background-color: rgba(16, 185, 129, 0.2);
                        color: rgb(16, 185, 129);
                    }
                    
                    /* Confidence score */
                    .confidence-score {
                        display: flex;
                        align-items: center;
                        padding: 8px 12px;
                        border-radius: 6px;
                        background-color: ${isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)'};
                        width: fit-content;
                        margin-top: 8px;
                    }
                    .confidence-icon {
                        margin-right: 8px;
                    }
                    .confidence-label {
                        font-weight: 600;
                        margin-right: 6px;
                    }
                    .confidence-value {
                        font-weight: 500;
                    }
                `}</style>

                <div className={`mt-6 rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Header */}
                    <div className={`py-6 px-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    Patient AI Assistant
                                </h1>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Patient ID: {patientId || 'Unknown'}
                                </p>
                            </div>
                            <div className={`flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                <div className="w-3 h-3 rounded-full bg-current mr-2"></div>
                                <span className="text-sm font-medium">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat conversation area */}
                    <div className={`p-6 overflow-y-auto h-96 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3/4 rounded-lg px-4 py-2 ${messageBubbleStyle(message.sender)}`}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                        }}
                                    >
                                        {message.text}
                                    </ReactMarkdown>
                                    <p
                                        className={`text-xs mt-1 text-right ${message.sender === 'user'
                                            ? 'text-blue-100'
                                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div
                                    className={`rounded-lg px-4 py-2 ${isDarkMode
                                        ? 'bg-gray-700 text-gray-200'
                                        : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                >
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-end space-x-2">
                            <textarea
                                ref={inputRef}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your question here..."
                                className={`flex-grow p-3 rounded-lg resize-none focus:outline-none min-h-24 ${isDarkMode
                                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400'
                                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                    }`}
                                rows={3}
                            />
                            <button
                                onClick={handleSendQuestion}
                                disabled={isLoading || !question.trim()}
                                className={`p-3 rounded-lg h-12 w-12 flex items-center justify-center ${isLoading || !question.trim()
                                    ? isDarkMode
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;