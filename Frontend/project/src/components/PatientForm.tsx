import React, { useState } from 'react';

interface PatientFormProps {
  token: string;
  onPatientCreated: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ token, onPatientCreated }) => {
  const [formData, setFormData] = useState({
    id: Math.floor(Math.random() * 10000), // Generate a random ID for demo purposes
    name: '',
    gender: 'Male',
    age: 30,
    dob: '',
    temperature: 98.6,
    pulse: 72,
    bloodPressure: '120/80',
    height: 170,
    weight: 70,
    condition: '',
    description: '',
    symptoms: '',
    personalHistory: '',
    familyHistory: '',
    allergies: '',
    medications: '',
    reports: '',
    remarks: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['age', 'temperature', 'pulse', 'height', 'weight'].includes(name) 
        ? parseFloat(value) 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create patient');
      }

      setSuccess(true);
      setTimeout(() => {
        onPatientCreated();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Patient</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Patient created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Vital Signs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°F)
            </label>
            <input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 mb-1">
              Pulse (bpm)
            </label>
            <input
              id="pulse"
              name="pulse"
              type="number"
              value={formData.pulse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure
            </label>
            <input
              id="bloodPressure"
              name="bloodPressure"
              type="text"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="120/80"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              id="height"
              name="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Medical Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Condition
            </label>
            <input
              id="condition"
              name="condition"
              type="text"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms
            </label>
            <input
              id="symptoms"
              name="symptoms"
              type="text"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="personalHistory" className="block text-sm font-medium text-gray-700 mb-1">
              Personal History
            </label>
            <textarea
              id="personalHistory"
              name="personalHistory"
              rows={3}
              value={formData.personalHistory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700 mb-1">
              Family History
            </label>
            <textarea
              id="familyHistory"
              name="familyHistory"
              rows={3}
              value={formData.familyHistory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </label>
            <textarea
              id="allergies"
              name="allergies"
              rows={3}
              value={formData.allergies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
              Current Medications
            </label>
            <textarea
              id="medications"
              name="medications"
              rows={3}
              value={formData.medications}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="reports" className="block text-sm font-medium text-gray-700 mb-1">
              Reports
            </label>
            <textarea
              id="reports"
              name="reports"
              rows={3}
              value={formData.reports}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || success}
            className={`py-2 px-6 rounded-md text-white font-medium ${
              isLoading || success ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition duration-200`}
          >
            {isLoading ? 'Creating...' : success ? 'Created!' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;