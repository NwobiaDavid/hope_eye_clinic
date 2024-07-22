import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ConsultationComp from '../components/sections/ConsultationComp';
import AppointmentComp from '../components/sections/AppointmentComp';
import CartComponent from '../components/sections/CartComp';
import TestComp from '../components/sections/TestComp';
import SurgeryComp from '../components/sections/SurgeryComp';
import { Plus } from "lucide-react";

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
import { Button } from "../components/ui/button"

const PatientDetailsPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newStatus, setNewStatus] = useState("Not Paid");
  const [newGender, setNewGender] = useState("Male");
  const [newAge, setNewAge] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [nextName, setNextName] = useState("");
  const [nextNumber, setNextNumber] = useState("")
  const [nextRelationship, setNextRelationship] = useState("")
  const [nextAddress, setNextAddress] = useState("")

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/patients/${id}`);
        const data = response.data;
        setPatient(data);
        setNewName(data.firstName);
        setNewSurname(data.lastName);
        setNewStatus(data.regStatus);
        setNewGender(data.gender);
        setNewAge(data.age);
        setNewPhonenumber(data.phoneNumber);
        setNewAddress(data.address);
        setNextName(data.next_of_kin_name);
        setNextNumber(data.next_of_kin_number);
        setNextRelationship(data.next_of_kin_relationship);
        setNextAddress(data.next_of_kin_address);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleNewGenderChange = (gender) => {
    setNewGender(gender);
  };

  const handleNewStatusChange = (status) => {
    setNewStatus(status);
  };

  const updatePatient = async () => {
    try {
      const updatedPatient = {
        firstName: newName,
        lastName: newSurname,
        regStatus: newStatus,
        gender: newGender,
        age: newAge,
        phoneNumber: newPhonenumber,
        address: newAddress,
        next_of_kin_name: nextName,
        next_of_kin_number: nextNumber,
        next_of_kin_relationship: nextRelationship,
        next_of_kin_address: nextAddress,
      };
      await axios.put(`http://localhost:3000/api/patients/${id}`, updatedPatient);
      setPatient(updatedPatient);  // Update the local state to reflect changes
    } catch (error) {
      console.error("Error updating patient data:", error);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center ">
      <div className="w-[60%]  ">
        {patient ? (
          <div>
            <div className='text-2xl'>
              <div className='flex relative justify-center p-14 items-center' >
                <div className=' h-[200px]  overflow-hidden border w-[200px] rounded-full bg-gray-200 flex justify-center items-center '>
                  
                  <img className=' ' src="/avat.jpg" alt="" />
                </div>
                <div className='ml-4' >
                  <p className='text-3xl font-semibold ' >{patient.lastName} {patient.firstName} </p>
                  <p>
                    {patient.note?.trim() === "" ? patient.note : (
                      "no doc note"
                    )}
                  </p>
                </div>
                <div className=" right-[20px] absolute">
                  <Dialog>
                    <DialogTrigger>
                      <Button className="flex justify-center">
                        <Plus /> <span className="ml-2">Edit Patient</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Patient</DialogTitle>
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
                                value={newAge}
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
                                value={nextName}
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
                                value={nextNumber}
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
                                value={nextRelationship}
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
                                value={nextAddress}
                                onChange={(e) => setNextAddress(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={updatePatient}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className='border-t flex flex-col justify-center items-center py-14 px-20 ' >
                <div className='w-full ' >
                  <div className="flex justify-center items-center ">
                    <div className='flex w-[90%] py-3 border-b justify-between '>
                      <h2 className=' text-3xl capitalize font-semibold ' >Personal Details</h2>
                      <div className={` border rounded-lg p-1 ${patient.regStatus === "Not Paid" ? ("border-red-500 text-red-700 bg-red-200 ") : ("border-green-500 bg-green-200 text-green-700 ")}`} > {patient.regStatus} </div>
                    </div>
                  </div>
                  <div className='flex justify-center items-center'>
                    <div className='grid w-[90%] grid-cols-2 justify-center items-center gap-5 ' >
                      <p className='capitalize '><span className="font-semibold">age: </span>{patient.age}</p>
                      <p className='capitalize '><span className="font-semibold">address:</span>{patient.address}</p>
                      <p className='capitalize '><span className="font-semibold">phone number:</span>{patient.phoneNumber}</p>
                      <p className='capitalize '><span className="font-semibold">gender: </span> {patient.gender} </p>
                    </div>
                  </div>
                </div>
                {patient.next_of_kin_name && patient.next_of_kin_name.trim() !== "" && (
                  <div className='mt-5 w-[90%] py-5 rounded-lg border border-orange-500 px-2 bg-orange-100' >
                    <div className="flex justify-center items-center">
                      <div className="flex w-full  py-3 border-b border-orange-500 justify-center ">
                        <h2 className="text-3xl capitalize font-semibold">Next of Kin Details</h2>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="grid w-[80%] grid-cols-2 justify-center items-center gap-5">
                        <p className="capitalize"><span className="font-semibold">Name:</span>{patient.next_of_kin_name}</p>
                        <p className="capitalize"><span className="font-semibold">Address:</span> {patient.next_of_kin_address}</p>
                        <p className="capitalize"><span className="font-semibold">Phone Number:</span> {patient.next_of_kin_number}</p>
                        <p className="capitalize"><span className="font-semibold">Relationship:</span> {patient.next_of_kin_relationship}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t">
                <ConsultationComp id={id} />
              </div>
              <div className="border-t">
                <AppointmentComp id={id} />
              </div>
              <div>
                <CartComponent id={id} />
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
    </div>
  );
};

export default PatientDetailsPage;
