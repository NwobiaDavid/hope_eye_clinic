import { SetStateAction, useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import { Menu, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
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
import { Label } from "../components/ui/label"
import axios from 'axios';
// import { Textarea } from '../components/ui/textarea';



interface Test {
    id: number;
    test_date: string;
    doctor_name: string;
    type: string;
    patient_id: number;
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
}


const TestPage = () => {
    const [data, setData] = useState<Test[]>([]);
    const [newName, setNewName] = useState("");
    const [newSurname, setNewSurname] = useState("");
    const [newStatus, setNewStatus] = useState("Open");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("");
    const [type, setType] = useState("");
    const [selectedTest, setSelectedTest] = useState<Test>();

    // const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient>();
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);

    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<{ test: Test, patient: Patient | undefined } | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/patients');
                setPatients(response.data);
                // setLoading(false);
            } catch (err) {
                console.log('Failed to fetch patients');
                // setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/api/tests')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching tests:', error);
            });
    }, []);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        const name = patient.firstName + " " + patient.lastName;
        setNewName(name);
    };

    const handleSearch = () => {
        // event.preventDefault();
        if (patients.length > 0) {
            const results = patients.filter(patient => {
                const name = `${patient.firstName.toLowerCase()} ${patient.lastName.toLowerCase()}`;
            return name.includes(newName);
            });
            setSearchResults(results);
        }
    };

    const addTest = async () => {
        if (!selectedPatient || !newSurname || !date || !time || !type) {
            return;
        }

        const typeData = {
            test_date: `${format(date, 'yyyy-MM-dd')} ${time}`,
            doctor_name: newSurname,
            type,
            patient_id: selectedPatient.id,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/tests', typeData);
            setData(prevData => [...prevData, response.data]);
            setNewName('');
            setNewSurname('');
            setDate(undefined);
            setType('');
            setTime('');
            setSelectedPatient(undefined);
            setSearchResults([]);
        } catch (error) {
            console.error('Error adding test:', error);
        }
    };

    const handleEdit = (test: Test) => {
        setSelectedTest(test);
        setNewSurname(test.doctor_name);
        setDate(new Date(test.test_date));
        setTime(format(new Date(test.test_date), 'HH:mm'));
        setNewStatus(new Date(test.test_date).getHours() < 12 ? 'AM' : 'PM');
        setType(test.type);
    };

    const deleteTest = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/tests/${id}`);
            setData(prevData => prevData.filter(test => test.id !== id));
        } catch (error) {
            console.error('Error deleting test:', error);
        }
    };

    const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
        setNewStatus(newStatus);
    };

    const viewDetails = (test: Test) => {
        const patient = patients.find(p => p.id === test.patient_id);
        setSelectedDetails({ test, patient });
        setDetailsDialogOpen(true);
    };

    return (
        <div className="px-6 py-3">
        <div className='flex flex-col justify-center items-center'>
            <div className='w-[80%]'>
                <div className="flex justify-between py-4 items-center">
                    <h2 className="py-2 px-4 bg-black text-white rounded-md">Test</h2>

                    <Dialog>
                        <DialogTrigger>
                            <Button className="flex justify-center">
                                <Plus /> <span className="ml-2 capitalize">{selectedTest ? 'Edit Test' : 'Schedule Test'}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="capitalize">{selectedTest ? 'Edit Test' : 'Book Test'}</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="patientName" className="text-right">
                                                Patient Name
                                            </Label>
                                            <Input
                                                id="patientName"
                                                onChange={(e) => { setNewName(e.target.value); handleSearch() }}
                                                value={newName}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="w-full " >
                                            {searchResults && (
                                                <div className="mt-4 w-full ">
                                                    {searchResults.length > 0 ? (
                                                        <div>
                                                            {searchResults.map((patient) => (
                                                                <div key={patient.id} className='py-2 text-center w-full capitalize cursor-pointer px-3 border hover:bg-gray-100 duration-200 rounded-lg mb-2' onClick={() => handleSelectPatient(patient)}>
                                                                    {patient.firstName + " " + patient.lastName}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p>No patients found</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="doctorName" className="text-right">
                                                Doctor Name
                                            </Label>
                                            <Input
                                                id="doctorName"
                                                value={newSurname}
                                                onChange={(e) => setNewSurname(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="date" className="text-right">
                                                Date
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="time" className="text-right">
                                                Time
                                            </Label>
                                            <div className=' flex gap-2' >
                                                <Input
                                                    id="time"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="col-span-3"
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="border p-2 rounded-lg">{newStatus}</DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Time of Day</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleNewStatusChange("AM")}>AM</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleNewStatusChange("PM")}>PM</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="type" className="text-right">
                                                Type
                                            </Label>
                                            <Input
                                            id="type"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="col-span-3" />
                                        </div>
                                    
                                    </div>
                                                                </div>
                                </div>
                            <DialogFooter>
                                <Button type="button" onClick={addTest}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className='flex justify-center items-center'>
                    <Table>
                        <TableCaption>A list of scheduled Tests</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Test ID</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Doctor Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Test Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="py-2">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => {
                                const patient = patients.find(p => p.id === item.patient_id);
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown'}</TableCell>
                                        <TableCell>{item.doctor_name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell className="py-2">{format(new Date(item.test_date), 'PPP')}</TableCell>
                                        <TableCell className="py-2">{format(new Date(item.test_date), 'hh:mm a')}</TableCell>
                                        <TableCell className="py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteTest(item.id)}>Delete</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => viewDetails(item)}>View Details</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>

        {selectedDetails && (
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Test Details</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p><strong>Test ID:</strong> {selectedDetails.test.id}</p>
                        <p><strong>Patient Name:</strong> {selectedDetails.patient ? `${selectedDetails.patient.firstName} ${selectedDetails.patient.lastName}` : 'Unknown'}</p>
                        <p><strong>Patient Phone Number:</strong> {selectedDetails.patient ? selectedDetails.patient.phoneNumber : 'Unknown'}</p>
                        <p><strong>Doctor Name:</strong> {selectedDetails.test.doctor_name}</p>
                        <p><strong>Type:</strong> {selectedDetails.test.type}</p>
                        <p><strong>Date:</strong> {format(new Date(selectedDetails.test.test_date), 'PPP')}</p>
                        <p><strong>Time:</strong> {format(new Date(selectedDetails.test.test_date), 'hh:mm a')}</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </div>
    );
};

export default TestPage;
