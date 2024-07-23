import { useEffect, useState } from 'react';
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
// import { Link } from 'react-router-dom';
import axios from 'axios';
// import { Textarea } from '../components/ui/textarea';

interface Drug {
    id: number;
    name: string;
    manufacturer: string;
    amount: number;
    price: number;
}

const DrugInventory = () => {
    const [data, setData] = useState<Drug[]>([]);
    // const [newStatus, setNewStatus] = useState("Open");
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<{ drug: Drug } | null>(null);
    const [amount, setAmount] = useState('');
    const [newName, setNewName] = useState('');
    const [price, setPrice] = useState('');
    const [manufacturer, setManufacturer] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/api/drugs')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching drugs:', error);
            });
    }, []);

    const addDrug = async () => {
        if (!amount || !price || !manufacturer || !newName) {
            return;
        }

        const drugData = {
            amount,
            price,
            manufacturer,
            name: newName,
        };

        try {
            if (selectedDrug) {
                // Update existing drug
                const response = await axios.put(`http://localhost:3000/api/drugs/${selectedDrug.id}`, drugData);
                setData(prevData => prevData.map(drug => drug.id === selectedDrug.id ? response.data : drug));
            } else {
                // Add new drug
                const response = await axios.post('http://localhost:3000/api/drugs', drugData);
                setData(prevData => [...prevData, response.data]);
            }
            setSelectedDrug(null);
            setAmount('');
            setPrice('');
            setNewName('');
            setManufacturer('');
        } catch (error) {
            console.error('Error adding drug:', error);
        }
    };

    const handleEdit = (drug: Drug) => {
        setSelectedDrug(drug);
        setAmount(drug.amount.toString());
        setPrice(drug.price.toString());
        setManufacturer(drug.manufacturer);
        setNewName(drug.name);
    };

    const deleteDrug = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/drugs/${id}`);
            setData(prevData => prevData.filter(drug => drug.id !== id));
        } catch (error) {
            console.error('Error deleting drug:', error);
        }
    };

    // const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
    //     setNewStatus(newStatus);
    // };

    const viewDetails = (drug: Drug) => {
        setSelectedDetails({ drug });
        setDetailsDialogOpen(true);
    };

    return (
        <div className="px-6 py-3">
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <div className="flex justify-between py-4 items-center">
                        <h2 className="py-2 px-4 bg-black text-white rounded-md">Drug Inventory</h2>

                        <Dialog>
                            <DialogTrigger>
                                <Button className="flex justify-center">
                                    <Plus /> <span className="ml-2 capitalize">{selectedDrug ? 'Edit Drug' : 'Add Drug'}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="capitalize">{selectedDrug ? 'Edit Drug' : 'Add Drug'}</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                        <div className="grid grid-cols-1 items-center gap-4">
                                            <div>
                                                <Label htmlFor="drugName" className="text-right">
                                                    Drug Name
                                                </Label>
                                                <Input
                                                    id="drugName"
                                                    onChange={(e) => { setNewName(e.target.value); }}
                                                    value={newName}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 items-center gap-4">
                                            <div>
                                                <Label htmlFor="manu" className="text-right">
                                                    Manufacturer
                                                </Label>
                                                <Input
                                                    id="manu"
                                                    value={manufacturer}
                                                    onChange={(e) => setManufacturer(e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="grid grid-cols-1 items-center gap-4">
                                            <div>
                                                <Label htmlFor="amount" className="text-right">
                                                    Amount
                                                </Label>
                                                <Input
                                                    id="amount"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 items-center gap-4">
                                            <div>
                                                <Label htmlFor="price" className="text-right">
                                                    Price
                                                </Label>
                                                <div className=' flex gap-2'>
                                                    <Input
                                                        id="price"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={addDrug}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='flex justify-center items-center'>
                        <Table>
                            <TableCaption>A list of scheduled drugs</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Drug ID</TableHead>
                                    <TableHead>Drug Name</TableHead>
                                    <TableHead>Manufacturer</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity in stock</TableHead>
                                    <TableHead className="py-2">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.manufacturer}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell className="py-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Menu /></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteDrug(item.id)}>Delete</DropdownMenuItem>
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
                            <DialogTitle>Drug Details</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p><strong>Drug ID:</strong> {selectedDetails.drug.id}</p>
                            <p><strong>Drug Name:</strong> {selectedDetails.drug ? `${selectedDetails.drug.name} ` : 'Unknown'}</p>
                            <p><strong>Manufacturer:</strong> {selectedDetails.drug.manufacturer}</p>
                            <p><strong>Price:</strong> {selectedDetails.drug.price}</p>
                            <p><strong>Quantity in Stock:</strong> {selectedDetails.drug.amount}</p>
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

export default DrugInventory;
