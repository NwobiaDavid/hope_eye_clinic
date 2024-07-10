import { SetStateAction, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const TestPage = () => {
    const initialData = [
        { id: "TEST001", patientName: "John Doe", date: "2024-06-18", time: "10:00 AM", status: "Not-yet" }
    ];

    const [data, setData] = useState(initialData);
    const [newPatientName, setNewPatientName] = useState("");
    const [newDate, setNewDate] = useState<Date>();
    const [newTime, setNewTime] = useState("");
    const [newStatus, setNewStatus] = useState("Not Yet");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [day, setDay] = useState("AM/PM")

    const handleStatusChange = (index: number, newStatus: string) => {
        const updatedData = data.map((item, i) =>
            i === index ? { ...item, status: newStatus } : item
        );
        setData(updatedData);
    };

    const handleNewDayChange = (day: SetStateAction<string>) => {
        setDay(day);
    }

    const handleSave = () => {
        const newTest = {
            id: `TEST${String(data.length + 1).padStart(3, '0')}`,
            patientName: newPatientName,
            date: newDate ? format(newDate, "yyyy-MM-dd") : "",
            time: newTime,
            status: newStatus,
        };
        setData([...data, newTest]);
        setNewPatientName("");
        setNewDate(undefined);
        setNewTime("");
        setNewStatus("Not-yet");
        setIsDialogOpen(false);
    };

    return (
        <div className="px-6 py-3">
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <div className="flex justify-between py-4 items-center">
                        <h2 className="py-2 px-4 bg-black text-white rounded-md">Test Schedule</h2>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Schedule Test
                        </Button>
                    </div>

                    <Table>
                        <TableCaption>A list of scheduled tests</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.patientName}</TableCell>
                                    <TableCell className="text-right">{item.date}</TableCell>
                                    <TableCell className="text-right">{item.time}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>{item.status}</DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusChange(index, "Complete")}>Complete</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(index, "Rescheduled")}>Rescheduled</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(index, "Not-yet")}>Not-yet</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Schedule a New Test</DialogTitle>
                                    
                                </DialogHeader>
                                <DialogDescription>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="patient-name" className="text-right">
                                            Patient Name
                                        </Label>
                                        <Input
                                            id="patient-name"
                                            placeholder='Name of Patient'
                                            onChange={(e) => setNewPatientName(e.target.value)}
                                            value={newPatientName}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="date" className="text-right">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !newDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={newDate}
                                                    onSelect={setNewDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="time" className="text-right">
                                            Time
                                        </Label>
                                        <Input
                                            id="time"
                                            placeholder='Time of Test'
                                            onChange={(e) => setNewTime(e.target.value)}
                                            value={newTime}
                                            className="col-span-2"
                                        />
                                        <DropdownMenu>
                                <DropdownMenuTrigger className="border p-2 rounded-lg " >{day}</DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Time of Day</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleNewDayChange("AM")}>AM</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleNewDayChange("PM")}>PM</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='p-2 border rounded-lg' >{newStatus}</DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setNewStatus("Complete")}>Complete</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewStatus("Rescheduled")}>Rescheduled</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewStatus("Not Yet")}>Not Yet</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex justify-between ">
                                        <DialogClose asChild>
                                            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                                        </DialogClose>
                                        <Button onClick={handleSave}>Save</Button>
                                    </div>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestPage;
