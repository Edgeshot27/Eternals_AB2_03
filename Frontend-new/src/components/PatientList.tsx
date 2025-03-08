import React, { useState } from 'react';
import { Search, ChevronRight, User, Calendar, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  description: string;
  gender: string;
  doctor_id: string;
  latest_risk_factor: string; // Add latest_risk_factor attribute
}

interface PatientListProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
  isDarkMode?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onPatientSelect, isDarkMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patient: Patient) => {
    onPatientSelect(patient); // This will trigger the tab change in Dash
  };

  const getRiskFactorColor = (riskFactor?: string) => {
    if (!riskFactor) return 'bg-gray-100 text-gray-800';
    switch (riskFactor.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Patients
        </h2>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} h-5 w-5`} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors duration-300 ${isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className={`rounded-lg shadow p-6 text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
          }`}>
          {patients.length === 0 ?
            "No patients found. Add your first patient!" :
            "No patients match your search criteria."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}
              onClick={() => handlePatientClick(patient)}
            >
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {patient.name}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {patient.condition}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <User className="h-4 w-4 mr-2" />,
                      label: `ID: ${patient.id ? patient.id.substring(0, 8) + '...' : 'N/A'}`
                    },
                    {
                      icon: <Calendar className="h-4 w-4 mr-2" />,
                      label: `Age: ${patient.age}`
                    },
                    {
                      icon: <HeartPulse className="h-4 w-4 mr-2" />,
                      label: `Condition: ${patient.condition}`
                    },
                    {
                      icon: <HeartPulse className="h-4 w-4 mr-2" />,
                      label: `Risk: ${patient.latest_risk_factor || 'Unknown'}`, // Provide a default value if undefined
                      color: getRiskFactorColor(patient.latest_risk_factor)
                    }
                  ].map((item, index) => (
                    <div
                      key={`${patient.id}-${index}`}
                      className={`flex items-center ${index === 2 ? 'col-span-2 mt-2' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                      {item.icon}
                      <span className={`text-sm ${item.color ? item.color : ''}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`p-3 flex justify-end items-center transition-colors ${isDarkMode ? 'bg-gray-800 text-blue-400 hover:text-blue-300' : 'bg-gray-50 text-blue-600 hover:text-blue-900'
                  }`}
              >
                <span className="text-sm font-medium">View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;