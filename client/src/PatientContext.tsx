import  { createContext, useState, useContext, ReactNode } from 'react';

interface Appointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  fee: string;
  status: string;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  age: number;
  gender: string;
  status: string;
  appointments: Appointment[]
}

interface PatientContextType {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <PatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
