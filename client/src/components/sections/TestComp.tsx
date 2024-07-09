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

interface Test {
    id: number;
    type: string;
    doctor_name: string;
    patient_id: number;
    test_date: string;
}

interface TestCompProps {
    id: number;
}

const TestComp: React.FC<TestCompProps> = ({id}) => {
    const [docname, setDocname] = useState<string>('');
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [newStatus, setNewStatus] = useState<'AM' | 'PM'>('AM');
    const [data, setData] = useState<Test[]>([]);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);

    useEffect(() => {
        // Fetch Test for the patient
        axios.get(`http://localhost:3000/api/tests?patient_id=${id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching Test:', error);
            });
    }, [id]);

    const handleNewStatusChange = (newStatus: 'AM' | 'PM') => {
        setNewStatus(newStatus);
    };

    const handleTypeChange = (type: 'Eye' | 'Eyelids') => {
        setType(type)
    }

    const addTest = () => {
        const newTest= {
            test_date: date,
            doctor_name: docname,
            type: '',
            patient_id: id,
        };

        axios.post('http://localhost:3000/api/tests', newTest)
            .then(response => {
                setData(prevData => [response.data, ...prevData]);
                setDocname('');
                setDate(null);
                setTime('');
                setNewStatus('AM');
            })
            .catch(error => {
                console.error('Error adding test:', error);
            });
    };

    const editTest = () => {
        if (!selectedTest) return;

        const updatedTest = {
            ...selectedTest,
            test_date: date,
            doctor_name: docname,
            type: ''
        };

        axios.put(`http://localhost:3000/api/tests/${selectedTest.id}`, updatedTest)
            .then(response => {
                setData(prevData => prevData.map(test=> test.id === response.data.id ? response.data : test));
                setDocname('');
                setDate(null);
                setTime('');
                setNewStatus('AM');
                setSelectedTest(null);
            })
            .catch(error => {
                console.error('Error editing test:', error);
            });
    };

    const deleteTest = (id: number) => {
        axios.delete(`http://localhost:3000/api/tests/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(test=> test.id !== id));
            })
            .catch(error => {
                console.error('Error deleting test:', error);
            });
    };

    const handleEdit = (test: Test) => {
        setSelectedTest(test);
        setDocname(test.doctor_name);
        setDate(new Date(test.test_date));
        setTime(format(new Date(test.test_date), 'HH:mm'));
        setNewStatus(new Date(test.test_date).getHours() < 12 ? 'AM' : 'PM');
    };

  return (
    <div>
    <div className='flex p-10 justify-around items-center' >
        <h2 className='text-3xl font-semibold ' >Test</h2>

        <Dialog >
            <DialogTrigger asChild>
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
                        <Label htmlFor="time" className="text-right">
                            Type
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="border p-2 rounded-lg">{type}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Type of Test</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleTypeChange('Eye')}>Eye</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange('Eyelids')}>Eyelids</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                    <Button type="button" onClick={selectedTest ? editTest : addTest}>
                        {selectedTest ? 'Save changes' : 'Add Test'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>

    <div className='w-full px-28 pb-14 ' >
      { data.length > 0 ? (  <Table className=" text-lg ">
            <TableHeader>
                <TableRow>
                    <TableHead className="py-2">Doctor</TableHead>
                    <TableHead className="py-2">Type</TableHead>
                    <TableHead className="py-2">Date</TableHead>
                    <TableHead className="py-2">Time</TableHead>
                    <TableHead className="py-2">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(test => (
                    <TableRow key={test.id} className="border-t">
                        <TableCell className="py-2">{test.doctor_name}</TableCell>
                        <TableCell className="py-2">{test.type}</TableCell>
                        <TableCell className="py-2">{format(new Date(test.test_date), 'PPP')}</TableCell>
                        <TableCell className="py-2">{format(new Date(test.test_date), 'hh:mm a')}</TableCell>
                        <TableCell className="py-2">
                            {/* <Button onClick={() => handleEdit(consult)}>Edit</Button>
                            <Button onClick={() => deleteConsult(test.id)} className="ml-2">Delete</Button> */}
                            <DropdownMenu>
                                <DropdownMenuTrigger> <Menu /> </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEdit(test)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteTest(test.id)} >Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table> 
        ): (
            <div className='font-semibold text-center opacity-50 ' >
                no test added yet
            </div>
        )}
    </div>
</div>
  )
}

export default TestComp