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

interface Consultation {
    id: number;
    consultation_date: string;
    doctor_name: string;
    diagnosis: string;
    prescription: string;
    patient_id: number;
}

interface ConsultationCompProps {
    id: number;
}

const ConsultationComp: React.FC<ConsultationCompProps> = ({ id }) => {
    const [docname, setDocname] = useState<string>('');
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>('');
    const [newStatus, setNewStatus] = useState<'AM' | 'PM'>('AM');
    const [data, setData] = useState<Consultation[]>([]);
    const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);

    useEffect(() => {
        // Fetch consultations for the patient
        axios.get(`http://localhost:3000/api/consultations?patient_id=${id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching consultations:', error);
            });
    }, [id]);

    const handleNewStatusChange = (newStatus: 'AM' | 'PM') => {
        setNewStatus(newStatus);
    };

    const addConsult = () => {
        const newConsult = {
            consultation_date: date,
            doctor_name: docname,
            diagnosis: '',
            prescription: '',
            patient_id: id,
        };

        axios.post('http://localhost:3000/api/consultations', newConsult)
            .then(response => {
                setData(prevData => [response.data, ...prevData]);
                setDocname('');
                setDate(null);
                setTime('');
                setNewStatus('AM');
            })
            .catch(error => {
                console.error('Error adding consultation:', error);
            });
    };

    const editConsult = () => {
        if (!selectedConsult) return;

        const updatedConsult = {
            ...selectedConsult,
            consultation_date: date,
            doctor_name: docname,
            diagnosis: '',
            prescription: '',
        };

        axios.put(`http://localhost:3000/api/consultations/${selectedConsult.id}`, updatedConsult)
            .then(response => {
                setData(prevData => prevData.map(consult => consult.id === response.data.id ? response.data : consult));
                setDocname('');
                setDate(null);
                setTime('');
                setNewStatus('AM');
                setSelectedConsult(null);
            })
            .catch(error => {
                console.error('Error editing consultation:', error);
            });
    };

    const deleteConsult = (id: number) => {
        axios.delete(`http://localhost:3000/api/consultations/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(consult => consult.id !== id));
            })
            .catch(error => {
                console.error('Error deleting consultation:', error);
            });
    };

    const handleEdit = (consult: Consultation) => {
        setSelectedConsult(consult);
        setDocname(consult.doctor_name);
        setDate(new Date(consult.consultation_date));
        setTime(format(new Date(consult.consultation_date), 'HH:mm'));
        setNewStatus(new Date(consult.consultation_date).getHours() < 12 ? 'AM' : 'PM');
    };

    return (
        <div>
            <div className='flex p-10 justify-around items-center' >
                <h2 className='text-3xl font-semibold ' >Consultations</h2>

                <Dialog >
                    <DialogTrigger asChild>
                        <Button className="flex justify-center">
                            <Plus /> <span className="ml-2 capitalize">{selectedConsult ? 'Edit Consultation' : 'Book Consultation'}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="capitalize">{selectedConsult ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
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
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={selectedConsult ? editConsult : addConsult}>
                                {selectedConsult ? 'Save changes' : 'Add Consultation'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='w-full px-28 pb-14 ' >
                <Table className=" text-lg ">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-2">Doctor</TableHead>
                            <TableHead className="py-2">Date</TableHead>
                            <TableHead className="py-2">Time</TableHead>
                            <TableHead className="py-2 text-right ">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(consult => (
                            <TableRow key={consult.id} className="border-t">
                                <TableCell className="py-2">{consult.doctor_name}</TableCell>
                                <TableCell className="py-2">{format(new Date(consult.consultation_date), 'PPP')}</TableCell>
                                <TableCell className="py-2">{format(new Date(consult.consultation_date), 'hh:mm a')}</TableCell>
                                <TableCell className="py-2 text-right ">
                                    {/* <Button onClick={() => handleEdit(consult)}>Edit</Button>
                                    <Button onClick={() => deleteConsult(consult.id)} className="ml-2">Delete</Button> */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger> <Menu /> </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleEdit(consult)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteConsult(consult.id)} >Delete</DropdownMenuItem>
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

export default ConsultationComp;
