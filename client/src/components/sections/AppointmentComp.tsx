import { Plus, CalendarIcon, Menu } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from "../ui/calendar"
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Appointment {
    id: number;
    appointment_date: string;
    doctor_name: string;
    reason: string;
    patient_id: number;
}

interface AppointmentCompProps {
    id: number;
}

const AppointmentComp: React.FC<AppointmentCompProps> = ({ id }) => {
    const [docname, setDocname] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>('');
    const [newStatus, setNewStatus] = useState<'AM' | 'PM'>('AM');
    const [reason, setReason] = useState<string>('');
    const [data, setData] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        // Fetch appointments for the patient
        axios.get(`http://localhost:3000/api/appointments?patient_id=${id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, [id]);

    const handleNewStatusChange = (newStatus: 'AM' | 'PM') => {
        setNewStatus(newStatus);
    };

    const addAppointment = () => {
        const newAppointment = {
            appointment_date: date,
            doctor_name: docname,
            reason: reason,
            patient_id: id,
        };

        axios.post('http://localhost:3000/api/appointments', newAppointment)
            .then(response => {
                setData(prevData => [response.data, ...prevData]);
                setDocname('');
                setTime('');
                setNewStatus('AM');
                setReason('');
            })
            .catch(error => {
                console.error('Error adding appointment:', error);
            });
    };

    const editAppointment = () => {
        if (!selectedAppointment) return;

        const updatedAppointment = {
            ...selectedAppointment,
            appointment_date: date,
            doctor_name: docname,
            reason: reason,
        };

        axios.put(`http://localhost:3000/api/appointments/${selectedAppointment.id}`, updatedAppointment)
            .then(response => {
                setData(prevData => prevData.map(appointment => appointment.id === response.data.id ? response.data : appointment));
                setDocname('');
                setTime('');
                setNewStatus('AM');
                setReason('');
                setSelectedAppointment(null);
            })
            .catch(error => {
                console.error('Error editing appointment:', error);
            });
    };

    const deleteAppointment = (id: number) => {
        axios.delete(`http://localhost:3000/api/appointments/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(appointment => appointment.id !== id));
            })
            .catch(error => {
                console.error('Error deleting appointment:', error);
            });
    };

    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setDocname(appointment.doctor_name);
        setDate(new Date(appointment.appointment_date));
        setTime(format(new Date(appointment.appointment_date), 'HH:mm'));
        setNewStatus(new Date(appointment.appointment_date).getHours() < 12 ? 'AM' : 'PM');
        setReason(appointment.reason);
    };

    return (
        <div>
            <div className='flex p-10 justify-around items-center'>
                <h2 className='text-3xl font-semibold '  >Appointments</h2>

                <Dialog >
                    <DialogTrigger asChild>
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
                                <Label htmlFor="doctor" className="text-right">
                                    Doctor Name
                                </Label>
                                <Input
                                    id="doctor"
                                    value={docname}
                                    onChange={(e) => setDocname(e.target.value)}
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
                                            variant="outline"
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
                                    className=""
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="border p-2 rounded-lg">{newStatus}</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Time of Day</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleNewStatusChange('AM')}>AM</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleNewStatusChange('PM')}>PM</DropdownMenuItem>
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
                            <Button type="button" onClick={selectedAppointment ? editAppointment : addAppointment}>
                                {selectedAppointment ? 'Save changes' : 'Add Appointment'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='w-full px-28 pb-14 ' >
                <Table className="min-w-full text-lg bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-2">Doctor</TableHead>
                            <TableHead className="py-2">Date</TableHead>
                            <TableHead className="py-2">Time</TableHead>
                            <TableHead className="py-2 text-right ">Reason</TableHead>
                            <TableHead className="py-2 text-right ">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(appointment => (
                            <TableRow key={appointment.id} className="border-t">
                                <TableCell className="py-2">{appointment.doctor_name}</TableCell>
                                <TableCell className="py-2">{format(new Date(appointment.appointment_date), 'PPP')}</TableCell>
                                <TableCell className="py-2">{format(new Date(appointment.appointment_date), 'hh:mm a')}</TableCell>
                                <TableCell className="py-2 text-right ">{appointment.reason}</TableCell>
                                <TableCell className="py-2 text-right">
                                    {/* <Button onClick={() => handleEdit(appointment)}>Edit</Button>
                                    <Button onClick={() => deleteAppointment(appointment.id)} className="ml-2">Delete</Button> */}
                                    <DropdownMenu>
                                                <DropdownMenuTrigger> <Menu/> </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEdit(appointment)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteAppointment(appointment.id)} >Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AppointmentComp;
