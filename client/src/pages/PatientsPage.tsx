/* eslint-disable @typescript-eslint/no-unused-vars */
import {  useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Menu, Plus, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from "date-fns";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  created_at: string;
  regStatus: string;
  age: string;
  phoneNumber: string;
}

// interface SelectedPatient extends Patient {
//   fullname: string;
//   regdate: string;
//   phonenumber: string;
//   status: string;
// }

const PatientPages = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Patient[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newSurname, setNewSurname] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("Not Paid");
  const [newGender, setNewGender] = useState<string>("Male");
  const [newAge, setNewAge] = useState<string>("");
  const [newPhonenumber, setNewPhonenumber] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  // const [selectedPatient, setSelectedPatient] = useState<Patient   | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const formatDate = (isoDate: string | number | Date) => {
    return format(new Date(isoDate), 'MMMM dd, yyyy HH:mm:ss');
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/patients');
      setData(response.data);
      console.log("my data-- " + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedPatient = { ...data[index], regStatus: newStatus };
    try {
      await axios.put(`http://localhost:3000/api/patients/${data[index].id}`, updatedPatient);
      const updatedData = data.map((item, i) => (i === index ? updatedPatient : item));
      setData(updatedData);
    } catch (error) {
      console.error("Error updating patient status:", error);
    }
  };

  // const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
  //   setNewStatus(newStatus);
  // };

  // const handleNewGenderChange = (newGender: SetStateAction<string>) => {
  //   setNewGender(newGender);
  // };

  const addPatient = async () => {
    const newPatient: Omit<Patient, 'id' | 'created_at'> = {
      firstName: newName,
      lastName: newSurname,
      gender: newGender,
      age: newAge,
      address: newAddress,
      phoneNumber: newPhonenumber,
      regStatus: newStatus
    };

    try {
      const response = await axios.post('http://localhost:3000/api/newpatients', newPatient);

      const createdPatient: Patient = response.data;
      console.log("new patient created == " + JSON.stringify(response.data));
      setData([...data, createdPatient]);
      setNewName("");
      setNewSurname("");
      setNewStatus("Not Paid");
      setNewGender("Male");
      setNewAge("");
      setNewPhonenumber("");
      setNewAddress("");
    } catch (error) {
      console.error("Error adding new patient:", error);
    }
  };

  const viewDetails = (patient: Patient) => {
    navigate(`/patients/${patient.id}`, { state: { patient } });
  };

  const editRecord = (patient: Patient) => {
    // setSelectedPatient(patient);
    setNewName(patient.firstName);
    setNewSurname(patient.lastName);
    setNewGender(patient.gender);
    setNewAge(patient.age);
    setNewPhonenumber(patient.phoneNumber);
    setNewAddress(patient.address);
    setNewStatus(patient.regStatus);
  };

  const printForm = () => {
    const formContent = `
      <h1>Patient Registration Form</h1>
      <p>First Name: ${newName}</p>
      <p>Surname: ${newSurname}</p>
      <p>Phone Number: ${newPhonenumber}</p>
      <p>Address: ${newAddress}</p>
      <p>Consultation Fee: 3000</p>
      <p>Age: ${newAge}</p>
      <p>Gender: ${newGender}</p>
      <p>Status: ${newStatus}</p>
    `;
    const printWindow = window.open('', '_blank');
    if(printWindow){
      printWindow.document.write(`<html><head><title>Print Form</title></head><body>${formContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();

    } else {
      console.error('Failed to open print window');
    }
  };

  // const saveEdit = async () => {
  //   if (!selectedPatient) return;

  //   const updatedPatient: SelectedPatient = {
  //     ...selectedPatient,
  //     fullname: `${newName} ${newSurname}`,
  //     gender: newGender,
  //     age: newAge,
  //     phonenumber: newPhonenumber,
  //     address: newAddress,
  //     status: newStatus,
  //   };

  //   try {
  //     await axios.put(`http://localhost:3000/api/patients/${selectedPatient.id}`, updatedPatient);
  //     const updatedData = data.map((item) => (item.id === selectedPatient.id ? updatedPatient : item));
  //     setData(updatedData);
  //     setSelectedPatient(null);
  //     setNewName("");
  //     setNewSurname("");
  //     setNewGender("Male");
  //     setNewAge("");
  //     setNewPhonenumber("");
  //     setNewAddress("");
  //     setNewStatus("Not Paid");
  //   } catch (error) {
  //     console.error("Error saving edited patient:", error);
  //   }
  // };

  const deleteRecord = async (patientId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/patients/${patientId}`);
      const updatedData = data.filter((item) => item.id !== patientId);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="px-6 py-3">
      <div className='flex flex-col justify-center items-center'>
        <div className='w-[80%]'>
          <div className="flex justify-between py-4 items-center">
            <h2 className="py-2 px-4 bg-black text-white rounded-md">Patients</h2>
            <div className='flex'>
              <Dialog>
                <DialogTrigger>
                  <Button className="flex justify-center">
                    <Plus /> <span className="ml-2">Add patients</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Patient</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className='grid grid-cols-2 gap-3'>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="firstname" className="text-right">
                            First Name
                          </Label>
                          <Input
                            id="firstname"
                            onChange={(e) => setNewName(e.target.value)}
                            value={newName}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="surname" className="whitespace-nowrap text-right">
                            Surname
                          </Label>
                          <Input
                            id="surname"
                            value={newSurname}
                            onChange={(e) => setNewSurname(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="age" className="whitespace-nowrap text-right">
                            Age
                          </Label>
                          <Input
                            id="age"
                            value={newAge}
                            onChange={(e) => setNewAge(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="address" className="whitespace-nowrap text-right">
                            Address
                          </Label>
                          <Input
                            id="address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <Label htmlFor="phonenumber" className="text-right">
                        Phone Number
                      </Label>
                      <Input
                        id="phonenumber"
                        value={newPhonenumber}
                        onChange={(e) => setNewPhonenumber(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <Label htmlFor="gender" className="text-right">
                        Gender
                      </Label>
                      <select id="gender" value={newGender} onChange={(e) => setNewGender(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Registration Status
                      </Label>
                      <select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        <option value="Paid">Paid</option>
                        <option value="Not Paid">Not Paid</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addPatient}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button className="flex justify-center ml-4" onClick={printForm}>
                <Printer /> <span className="ml-2">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">First Name</TableHead>
            <TableHead>Surname</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Consultation Fee</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reg Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient, index) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.firstName}</TableCell>
              <TableCell>{patient.lastName}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>3000</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                <select
                  value={patient.regStatus}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Not Paid">Not Paid</option>
                </select>
              </TableCell>
              <TableCell>{formatDate(patient.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Menu />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => viewDetails(patient)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editRecord(patient)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteRecord(patient.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientPages;
