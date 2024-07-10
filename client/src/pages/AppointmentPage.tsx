import { SetStateAction, useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import { Menu, Plus, Calendar as CalendarIcon } from "lucide-react";
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
import { Label } from "../components/ui/label";
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

interface Appointment {
    id: number;
    appointment_date: string;
    doctor_name: string;
    reason: string;
    patient_id: number;
}

const AppointmentPage = () => {
    const [data, setData] = useState<Appointment[]>([]);
    const [newName, setNewName] = useState("");
    const [newSurname, setNewSurname] = useState("");
    const [newStatus, setNewStatus] = useState("Open");
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<{ appointment: Appointment, patient: Patient | undefined } | null>(null);

    useEffect(() => {
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

    useEffect(() => {
        axios.get('http://localhost:3000/api/appointments')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, []);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        const name = patient.firstName + " " + patient.lastName;
        setNewName(name);
    };

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (patients.length > 0) {
            const results = patients.filter(patient => {
                const name = `${patient?.firstName?.toLowerCase()} ${patient?.lastName?.toLowerCase()}`;
                return name.includes(searchQuery.toLowerCase());
            });
            setSearchResults(results);
        }
    };

    const addAppointment = async () => {
        if (!selectedPatient || !newSurname || !date || !time || !reason) {
            return;
        }

        const appointmentData = {
            appointment_date: `${format(date, 'yyyy-MM-dd')} ${time}`,
            doctor_name: newSurname,
            reason,
            patient_id: selectedPatient.id,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/appointments', appointmentData);
            setData(prevData => [...prevData, response.data]);
            setNewName('');
            setNewSurname('');
            setDate(undefined);
            setTime('');
            setReason('');
            setSelectedPatient(null);
            setSearchResults([]);
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setNewSurname(appointment.doctor_name);
        setDate(new Date(appointment.appointment_date));
        setTime(format(new Date(appointment.appointment_date), 'HH:mm'));
        setNewStatus(new Date(appointment.appointment_date).getHours() < 12 ? 'AM' : 'PM');
        setReason(appointment.reason);
    };

    const deleteAppointment = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/appointments/${id}`);
            setData(prevData => prevData.filter(appointment => appointment.id !== id));
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
        setNewStatus(newStatus);
    };

    const viewDetails = (appointment: Appointment) => {
        const patient = patients.find(p => p.id === appointment.patient_id);
        setSelectedDetails({ appointment, patient });
        setDetailsDialogOpen(true);
    };

    return (
        <div className="px-6 py-3">
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <div className="flex justify-between py-4 items-center">
                        <h2 className="py-2 px-4 bg-black text-white rounded-md">Appointments</h2>

                        <Dialog>
                            <DialogTrigger>
                                <Button className="flex justify-center">
                                    <Plus /> <span className="ml-2 capitalize">{selectedAppointment ? 'Edit Appointment' : 'Schedule Appointment'}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="capitalize">{selectedAppointment ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="patientName" className="text-right">
                                            Patient Name
                                        </Label>
                                        <Input
                                            id="patientName"
                                            onChange={(e) => { setNewName(e.target.value); handleSearch(e) }}
                                            value={newName}
                                            className="col-span-3"
                                        />
                                        <div>
                                            {searchResults && (
                                                <div className="mt-4">
                                                    {searchResults.length > 0 ? (
                                                        <ul>
                                                            {searchResults.map((patient) => (
                                                                <li key={patient.id} className='py-2 text-center capitalize cursor-pointer px-3 border hover:bg-gray-100 duration-200 rounded-lg mb-2' onClick={() => handleSelectPatient(patient)}>
                                                                    {patient.firstName + " " + patient.lastName}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No patients found</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="date" className="text-right">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="time" className="text-right">
                                            Time
                                        </Label>
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="reason" className="text-right">
                                            Reason
                                        </Label>
                                        <Input
                                            id="reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={addAppointment}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='flex justify-center items-center'>
                        <Table>
                            <TableCaption>A list of scheduled appointments</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Appointment ID</TableHead>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Doctor Name</TableHead>
                                    <TableHead>Appointment Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Reason</TableHead>
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
                                            <TableCell className="py-2">{format(new Date(item.appointment_date), 'PPP')}</TableCell>
                                            <TableCell className="py-2">{format(new Date(item.appointment_date), 'hh:mm a')}</TableCell>
                                            <TableCell>{item.reason}</TableCell>
                                            <TableCell className="py-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteAppointment(item.id)}>Delete</DropdownMenuItem>
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
                            <DialogTitle>Appointment Details</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p><strong>Appointment ID:</strong> {selectedDetails.appointment.id}</p>
                            <p><strong>Patient Name:</strong> {selectedDetails.patient ? `${selectedDetails.patient.firstName} ${selectedDetails.patient.lastName}` : 'Unknown'}</p>
                            <p><strong>Patient Phone Number:</strong> {selectedDetails.patient ? selectedDetails.patient.phoneNumber : 'Unknown'}</p>
                            <p><strong>Doctor Name:</strong> {selectedDetails.appointment.doctor_name}</p>
                            <p><strong>Date:</strong> {format(new Date(selectedDetails.appointment.appointment_date), 'PPP')}</p>
                            <p><strong>Time:</strong> {format(new Date(selectedDetails.appointment.appointment_date), 'hh:mm a')}</p>
                            <p><strong>Reason:</strong> {selectedDetails.appointment.reason}</p>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default AppointmentPage;
