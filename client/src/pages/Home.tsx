import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Printer, Search, User2 } from 'lucide-react';
// import { patients } from '../../constants';
import { usePatient } from '../PatientContext';
import axios from 'axios'; 

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  age: number;
  gender: string;
  status: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedPatient } = usePatient();
  const navigate = useNavigate();
  
  
    useEffect(() => {
      // Fetch patient data from the backend
      const fetchPatients = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/patients'); 
          setPatients(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch patients');
          setLoading(false);
        }
      };
  
      fetchPatients();
    }, []);

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
      printWindow.document.write(`<html><head><title>Print Form</title></head><body>${formContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    };
  
    const adminLogin = (patient: Patient) => {
      setSelectedPatient(patient);
      navigate('/dashboard');
    }
    
    const handleSearch = (event: React.FormEvent) => {
      event.preventDefault();
      if (patients.length > 0) {
        console.log("currently searching--"+JSON.stringify(patients)+" --search "+searchQuery)
        const results = patients.filter(patient => {
          const name = patient?.firstName?.toLowerCase() + " " + patient?.lastName?.toLowerCase();
          console.log("patient name- "+JSON.stringify(patient) + "--"+name.includes(searchQuery.toLowerCase())) 
          return name.includes(searchQuery.toLowerCase());
        });
        console.log("search resu--"+JSON.stringify(results))
        setSearchResults(results);

      }

    };
  
    const handleSelectPatient = (patient: Patient) => {
      if(patient.name !== "admin"){
        setSelectedPatient(patient);
      }
      console.log("patient here-- "+JSON.stringify(patient))
      navigate(`/patients/${patient.id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <>
      <div className="w-screen h-screen flex flex-col justify-center items-center px-6 py-3">
        <div className="-mt-36 mb-20 flex-col flex justify-center items-center">
          <h2 className="text-7xl mb-6 font-semibold capitalize">welcome to hope eye clinic</h2>
          <div className="mb-4 flex items-center">
            <Button className="flex mr-2 justify-center" onClick={printForm}>
              <Printer /> <span className="ml-2">Print Reg Form</span>
            </Button>
            <Button className="flex justify-center" onClick={() => adminLogin({ id: 1, name: "admin", phoneNumber: "null", address: "null", age: 0, gender: "null", status: "null" })}>
              <User2 /> <span className="ml-2">Log in as admin</span>
            </Button>
          </div>
        </div>
        <form className="flex w-full max-w-[40%] items-center space-x-2" onSubmit={handleSearch}>
          <input
            type="text"
            className="p-3 rounded-full w-full outline-none focus:border-black duration-200 border"
            placeholder="Search for Existing Patient"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="active:scale-95 duration-200 px-4 py-3 bg-black text-white rounded-full"
            type="submit"
            onClick={handleSearch}
          >
            Search
          </button>
        </form>
        {searchResults && (
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((patient) => (
                  <li key={patient.id} className='py-2 text-center capitalize cursor-pointer px-3 border hover:bg-gray-100 duration-200 rounded-lg mb-2' onClick={() => handleSelectPatient(patient)}>
                    view {patient.firstName + " "+ patient.lastName}'s profile
                  </li>
                ))}
              </ul>
            ) : (
              <p>No patients found</p>
            )}
          </div>
        )}
        <Link to="/patients" className="text-xs font-semibold opacity-80">
          new patient? click me
        </Link>
      </div>
    </>
    );
}
export default Home