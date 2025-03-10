import React, { createContext, useContext, useState } from 'react';
import { Patient } from '../types';

interface PatientContextType {
    selectedPatient: Patient | null;
    setSelectedPatient: (patient: Patient | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    return (
        <PatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatient = () => {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error('usePatient must be used within a PatientProvider');
    }
    return context;
};