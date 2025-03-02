import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, LogOut } from 'lucide-react';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import ChatInterface from './ChatInterface';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

interface DashboardProps {
  token: string;
  userData: UserData | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8000/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handlePatientCreated = () => {
    fetchPatients();
    setActiveTab('patients');
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setActiveTab('chat');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">AIsculapius</h1>
          <p className="text-sm text-blue-200 mt-1">
            Welcome, {userData?.first_name} {userData?.last_name}
          </p>
        </div>
        
        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center w-full p-3 mb-2 rounded-md ${
              activeTab === 'patients' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Patients
          </button>
          
          <button
            onClick={() => setActiveTab('add-patient')}
            className={`flex items-center w-full p-3 mb-2 rounded-md ${
              activeTab === 'add-patient' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <UserPlus className="h-5 w-5 mr-3" />
            Add Patient
          </button>
          
          {selectedPatient && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center w-full p-3 mb-2 rounded-md ${
                activeTab === 'chat' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Chat
            </button>
          )}
        </nav>
        
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full p-3 rounded-md hover:bg-blue-700"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'patients' && (
          <PatientList 
            patients={patients} 
            onPatientSelect={handlePatientSelect} 
          />
        )}
        
        {activeTab === 'add-patient' && (
          <PatientForm 
            token={token} 
            onPatientCreated={handlePatientCreated} 
          />
        )}
        
        {activeTab === 'chat' && selectedPatient && (
          <ChatInterface 
            token={token} 
            patient={selectedPatient} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;