
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ConsultationComp from '../components/sections/ConsultationComp';
import AppointmentComp from '../components/sections/AppointmentComp';
import CartComponent from '../components/sections/CartComp';
import TestComp from '../components/sections/TestComp';
import SurgeryComp from '../components/sections/SurgeryComp';

const PatientDetailsPage = () => {
  const { id } = useParams();
  // const location = useLocation();
  // const patient = location.state?.patient;
  const [patient, setPatient] = useState(null);


  useEffect(() => {
    console.log("the id"+id)
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/patients/${id}`);
        const data = response.data;
        console.log("the patient "+JSON.stringify(data))
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
  
    fetchPatient();
  }, []);
  

  return (
    <div className="p-6">
      {patient ? (
      <div>
        {/* <h1 className="text-5xl font-bold mb-4">Patient: {patient.fullname}</h1> */}
        <div className='text-2xl'>
          <div className='flex justify-center p-14 items-center' >
            <div className=' h-[200px] border w-[200px] rounded-full bg-gray-200 flex justify-center items-center '>
              image here
            </div>
            <div className='ml-3' >
              <p className='text-3xl font-semibold ' >{patient.lastName} {patient.firstName} </p>
              <p>
                {patient.note?.trim() === "" ? patient.note : (
                  "no doc note"
                )}
              </p>
            </div>
          </div>
          <div className='border-t py-14 px-20 ' >
              <div className="flex justify-center items-center ">
                <div className='flex w-[50%] py-3 border-b justify-between '>
                  <h2 className=' text-3xl capitalize font-semibold ' >personal details</h2>
                  <div className={` border rounded-lg p-1 ${patient.regStatus === "Not Paid" ? ("border-red-500 text-red-700 bg-red-200 ") : ("border-green-500 bg-green-200 text-green-700 ")}`} > {patient.regStatus} </div>
                </div>
              </div>
              <div className='flex justify-center items-center'>
                <div className='grid w-[50%] grid-cols-2 justify-center items-center gap-5 ' >
                  <p className='capitalize '>age: {patient.age}</p>
                  <p className='capitalize '>address: {patient.address}</p>
                  <p className='capitalize '>phone number: {patient.phoneNumber}</p>
                  <p className='capitalize '>gender: {patient.gender}</p>
                </div>
              </div>
          </div>
          <div className="border-t">
            <ConsultationComp id={id} />
          </div>
          <div className="border-t">
            <AppointmentComp id={id} />
          </div>
          <div>
            <CartComponent/>
          </div>
          <div className="border-t">
            <TestComp id={id} />
          </div>
          <div className="border-t">
            <SurgeryComp id={id} />
          </div>
        </div>
      </div>
    ) : (
      <p>No patient details available.</p>
    )}
    </div>
  );
};

export default PatientDetailsPage;
