import { SetStateAction, useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Menu, Plus, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
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
} from "../components/ui/dialog"

import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from "date-fns";

const PatientPages = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newStatus, setNewStatus] = useState("Not Paid");
  const [newGender, setNewGender] = useState("Male");
  const [newAge, setNewAge] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [nextName, setNextName] = useState("");
  const [nextNumber, setNextNumber] = useState("")
  const [nextRelationship, setNextRelationship] = useState("")
  const [nextAddress, setNextAddress] = useState("")

  useEffect(() => {
    fetchPatients();
  }, []);

  // const { format } = require('date-fns');

  const formatDate = (isoDate: string | number | Date) => {
    return format(new Date(isoDate), 'MMMM dd, yyyy HH:mm:ss');
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/patients');
      // const patients = await response.json();
      setData(response.data);
      console.log("my data-- " + JSON.stringify(response.data))
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

  const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
    setNewStatus(newStatus);
  };

  const handleNewGenderChange = (newGender: SetStateAction<string>) => {
    setNewGender(newGender);
  };

  const addPatient = async () => {
    const newPatient = {
      firstName: newName,
      lastName: newSurname,
      gender: newGender,
      age: newAge,
      address: newAddress,
      phoneNumber: newPhonenumber,
      regStatus: newStatus
    };

    try {
      const response = await axios.post('http://localhost:3000/api/newpatients',
        newPatient);

      const createdPatient = response.data;
      console.log("new patient created == " + JSON.stringify(response.data))
      setData([...data, createdPatient]);
      setNewName("");
      setNewSurname("");
      setNewStatus("Open");
      setNewGender("Gender");
      setNewAge("");
      setNewPhonenumber("");
      setNewAddress("");
    } catch (error) {
      console.error("Error adding new patient:", error);
    }
  };

  const viewDetails = (patient: never) => {
    navigate(`/patients/${patient.id}`, { state: { patient } });
  };

  const editRecord = (patient: SetStateAction<null>) => {
    setSelectedPatient(patient);
    const [firstName, ...rest] = patient.fullname.split(" ");
    setNewName(firstName);
    setNewSurname(rest.join(" "));
    setNewGender(patient.gender);
    setNewAge(patient.age);
    setNewPhonenumber(patient.phonenumber);
    setNewAddress(patient.address);
    setNewStatus(patient.status);
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
    printWindow.document.write(`<html><head><title>Print Form</title></head><body>${formContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const saveEdit = async () => {
    const updatedPatient = {
      ...selectedPatient,
      fullname: `${newName} ${newSurname}`,
      gender: newGender,
      age: newAge,
      phonenumber: newPhonenumber,
      address: newAddress,
      status: newStatus,
    };

    try {
      await fetch(`http://localhost:5000/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });
      const updatedData = data.map((item) => (item.id === selectedPatient.id ? updatedPatient : item));
      setData(updatedData);
      setSelectedPatient(null);
      setNewName("");
      setNewSurname("");
      setNewGender("Gender");
      setNewAge("");
      setNewPhonenumber("");
      setNewAddress("");
      setNewStatus("Open");
    } catch (error) {
      console.error("Error saving edited patient:", error);
    }
  };

  const deleteRecord = async (patientId: any) => {
    try {
      await fetch(`http://localhost:3000/api/patients/${patientId}`, {
        method: 'DELETE',
      });
      const updatedData = data.filter((item) => item.id !== patientId);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="px-6 py-3">
      <div className='flex flex-col justify-center items-center' >
        <div className=' w-[80%] ' >
          <div className="flex justify-between py-4 items-center">
            <h2 className="py-2 px-4 bg-black text-white rounded-md">Patients</h2>
            <div className='flex ' >

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
                    <div className='grid grid-cols-2 gap-3 '>
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
                      <div className="w-full grid gap-4 grid-cols-4 text-center justify-center border-2 border-slate-400 bg-slate-300 items-center rounded-lg px-2">
                        <Label htmlFor="surname" className="text-right whitespace-nowrap capitalize ">
                          Consultation Fee
                        </Label>
                        <div className="w-full col-span-3 text-center flex justify-center font-semibold p-2">3000</div>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="age" className="whitespace-nowrap text-right">
                            Age
                          </Label>
                          <Input
                            id="age"
                            value={`${newAge}`}
                            onChange={(e) => setNewAge(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right  ">
                          Gender
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="border col-span-3 w-full p-2 rounded-lg">
                            {newGender}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Gender</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleNewGenderChange("Male")}>Male</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewGenderChange("Female")}>Female</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="grid grid-cols-4 justify-center items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Reg Status
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="border col-span-3 p-2 w-full rounded-lg">
                            {newStatus}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Reg Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleNewStatusChange("Paid")}>Paid</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewStatusChange("Not Paid")}>Not Paid</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div  className='grid grid-cols-2 gap-5 ' >

                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="nextName" className="whitespace-nowrap text-right">
                            Next of Kin's Name
                          </Label>
                          <Input
                            id="nextName"
                            value={`${nextName}`}
                            onChange={(e) => setNextName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="nextNumber" className="whitespace-nowrap text-right">
                            Next of Kin's Number
                          </Label>
                          <Input
                            id="nextNumber"
                            value={`${nextNumber}`}
                            onChange={(e) => setNextNumber(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="nextRelationship" className="whitespace-nowrap text-right">
                            Next of Kin's Relationship
                          </Label>
                          <Input
                            id="nextRelationship"
                            value={`${nextRelationship}`}
                            onChange={(e) => setNextRelationship(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-4">
                        <div>
                          <Label htmlFor="nextName" className="whitespace-nowrap text-right">
                            Next of Kin's Address
                          </Label>
                          <Input
                            id="nextAddress"
                            value={`${nextAddress}`}
                            onChange={(e) => setNextAddress(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={addPatient}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button className="flex ml-2 justify-center" onClick={printForm}>
                <Printer /> <span className="ml-2">Print Receipt</span>
              </Button>
            </div>
          </div>

          <div className='flex justify-center items-center'>
            <Table>
              <TableCaption>A list of patients</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Folder ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">gender</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell className="text-right">{item.gender}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>{item.regStatus}</DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Reg Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(index, "Paid")}>Paid</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(index, "Not Paid")}>Not Paid</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => viewDetails(item)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteRecord(item.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedPatient && (
            <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Patient Details</DialogTitle>
                  <DialogDescription>
                    Viewing details for {selectedPatient.fullname}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>Full Name: {selectedPatient.fullname}</div>
                  <div>Registration Date: {selectedPatient.regdate}</div>
                  <div>Address: {selectedPatient.address}</div>
                  <div>Phone Number: {selectedPatient?.phonenumber}</div>
                  <div>Age: {selectedPatient.age}</div>
                  <div>Gender: {selectedPatient.gender}</div>
                  <div>Status: {selectedPatient.status}</div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => setSelectedPatient(null)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {selectedPatient && (
            <Dialog open={!!selectedPatient && !!newName} onOpenChange={() => setSelectedPatient(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Patient</DialogTitle>
                  <DialogDescription>
                    Editing details for {selectedPatient.fullname}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className='grid grid-cols-2 gap-3 '>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-firstname" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="edit-firstname"
                        onChange={(e) => setNewName(e.target.value)}
                        value={newName}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-surname" className="whitespace-nowrap text-right">
                        Surname
                      </Label>
                      <Input
                        id="edit-surname"
                        value={newSurname}
                        onChange={(e) => setNewSurname(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-phonenumber" className="text-right">
                        Phone Number
                      </Label>
                      <Input
                        id="edit-phonenumber"
                        value={newPhonenumber}
                        onChange={(e) => setNewPhonenumber(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-address" className="whitespace-nowrap text-right">
                        Address
                      </Label>
                      <Input
                        id="edit-address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="w-full grid gap-4 grid-cols-4 text-center justify-center bg-slate-300 items-center rounded-lg px-2">
                      <Label htmlFor="edit-consultation-fee" className="text-right whitespace-nowrap capitalize ">
                        Consultation Fee
                      </Label>
                      <div className="w-full col-span-3 text-center flex justify-center font-semibold p-2">3000</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-age" className="whitespace-nowrap text-right">
                        Age
                      </Label>
                      <Input
                        id="edit-age"
                        value={`${newAge}`}
                        onChange={(e) => setNewAge(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2'>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-gender" className="text-right">
                        Gender
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="border col-span-3 w-full p-2 rounded-lg">
                          {newGender}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Gender</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleNewGenderChange("Male")}>Male</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNewGenderChange("Female")}>Female</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-4 justify-center items-center gap-4">
                      <Label htmlFor="edit-status" className="text-right">
                        Status
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="border p-2 rounded-lg">
                          {newStatus}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Reg Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleNewStatusChange("Paid")}>Paid</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNewStatusChange("Not Paid")}>Not Paid</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={saveEdit}>Save changes</Button>
                  <Button type="button" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientPages;
