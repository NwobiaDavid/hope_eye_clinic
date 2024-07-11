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
import SurgeryPage from './pages/SurgeryPage.tsx';
import TestPage from './pages/TestPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PatientProvider>
    <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="home" element={<Home />} />
            <Route path="patients/:id" element={<PatientDetailsPage />} />
          {/* Wrapping the Layout component around specific routes */}
          <Route element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientPages />} />
            <Route path="appointments" element={<AppointmentPage />} />
            <Route path="consultations" element={<ConsultationPage />} />
            <Route path="surgeries" element={<SurgeryPage />} />
            <Route path="tests" element={<TestPage />} />
          </Route>
        </Routes>
      </Router>
      </PatientProvider>
  </React.StrictMode>,
)
