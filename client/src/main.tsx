import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { PatientProvider } from './PatientContext.tsx';
import Home from './pages/Home.tsx';
import PatientPages from './pages/PatientsPage.tsx';
import PatientDetailsPage from './pages/PatientDetailsPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import Layout from './components/Layout.tsx';
import AppointmentPage from './pages/AppointmentPage.tsx';
import ConsultationPage from './pages/ConsultationPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PatientProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<Layout />} />
            <Route path="home" element={<Home />} />
            <Route path="patients" element={<PatientPages />} />
            <Route path="patients/:id" element={<PatientDetailsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentPage />} />
            <Route path="consultations" element={<ConsultationPage />} />
            {/* <Route path="patients" element={<PatientPages />} />
            <Route path="patients/:id" element={<PatientDetailsPage />} />
            <Route path="consultations" element={<ConsultationPage />} />
            <Route path="consultations/new" element={<NewConsultationPage />} />
            
            <Route path="tests" element={<TestPage />} />
            <Route path="surgeries" element={<SurgeryPage />} />
            <Route path="drug-inventory" element={<DrugInventory />} />
            <Route path="store-inventory" element={<StoreInventory />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} /> */}
          {/* </Route> */}
        </Routes>
      </Router>
      </PatientProvider>
  </React.StrictMode>,
)
