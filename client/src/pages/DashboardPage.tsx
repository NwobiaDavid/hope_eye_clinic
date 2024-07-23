// import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Printer } from "lucide-react";
// import { usePatient } from '../PatientContext';

const DashboardPage = () => {
//   const { selectedPatient } = usePatient();

  const pages = [
    {
      link: "/patients",
      label: "patients"
    },
    {
      link: "/appointments",
      label: "appointments"
    },
    {
      link: "/consultations",
      label: "consultations"
    },
    {
      link: "/tests",
      label: "tests"
    },
    {
      link: "/surgeries",
      label: "surgeries"
    },
    {
      link: "/drug-inventory",
      label: "drug inventory"
    },
    {
      link: "/store-inventory",
      label: "store inventory"
    },
    
  ];

  const printForm = () => {
    const formContent = `
      <h1>Patient Registration Form</h1>
      <p>First Name:</p>
      <p>Surname:</p>
      <p>Phone Number:</p>
      <p>Address:</p>
      <p>Consultation Fee: 3000</p>
      <p>Age:</p>
      <p>Gender:</p>
      <p>Status:</p>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Print Form</title></head><body>${formContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();

    }
  };

  return (
    <div className="px-6 py-3">
      <div className="flex items-center p-3 justify-between">
        <div>
          <h2 className="text-4xl capitalize">welcome to the Dashboard</h2>
          {/* <h2>{selectedPatient ? selectedPatient.name : 'No patient selected'}</h2> */}
        </div>
        <div>
          <Button className="flex ml-2 justify-center" onClick={printForm}>
            <Printer /> <span className="ml-2">Print Reg Form</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-3 grid-cols-4 items-center justify-center">
        {pages.map((item, index) => (
          <div className="flex justify-center items-center" key={index}>
            <Link
              to={item.link}
              className="w-[70%] h-[200px] capitalize text-lg duration-150 font-semibold active:scale-95 flex justify-center border items-center rounded-lg hover:bg-slate-200 hover:border-slate-700"
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
