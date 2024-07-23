import { useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import {  Menu, Plus } from "lucide-react";
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
import axios from 'axios';

interface Item {
    id: number;
    name: string;
    manufacturer: string;
    amount: number;
    price: number;
}

const StoreInventory = () => {
    const [data, setData] = useState<Item[]>([]);
    // const [newStatus, setNewStatus] = useState("Open");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<{ item: Item } | null>(null);
    const [amount, setAmount] = useState('');
    const [newName, setNewName] = useState('');
    const [price, setPrice] = useState('');
    const [manufacturer, setManufacturer] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/api/items')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    }, []);

    const addItem = async () => {
        if (!amount || !price || !manufacturer || !newName) {
            return;
        }

        const itemData = {
            amount,
            price,
            manufacturer,
            name: newName,
        };

        try {
            if (selectedItem) {
                // Update existing drug
                const response = await axios.put(`http://localhost:3000/api/items/${selectedItem.id}`, itemData);
                setData(prevData => prevData.map(item => item.id === selectedItem.id ? response.data : item));
            } else {
                // Add new drug
                const response = await axios.post('http://localhost:3000/api/items', itemData);
                setData(prevData => [...prevData, response.data]);
            }
            setSelectedItem(null);
            setAmount('');
            setPrice('');
            setNewName('');
            setManufacturer('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setAmount(item.amount.toString());
        setPrice(item.price.toString());
        setManufacturer(item.manufacturer);
        setNewName(item.name);
    };

    const deleteItem = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/items/${id}`);
            setData(prevData => prevData.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // const handleNewStatusChange = (newStatus: SetStateAction<string>) => {
    //     setNewStatus(newStatus);
    // };

    const viewDetails = (item: Item) => {
        setSelectedDetails({ item });
        setDetailsDialogOpen(true);
    };
    
    return (
        <div className="px-6 py-3">
        <div className='flex flex-col justify-center items-center'>
            <div className='w-[80%]'>
                <div className="flex justify-between py-4 items-center">
                    <h2 className="py-2 px-4 bg-black text-white rounded-md">Item Inventory</h2>

                    <Dialog>
                        <DialogTrigger>
                            <Button className="flex justify-center">
                                <Plus /> <span className="ml-2 capitalize">{selectedItem ? 'Edit Store Item' : 'Add Store Item'}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="capitalize">{selectedItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                    <div className="grid grid-cols-1 items-center gap-4">
                                        <div>
                                            <Label htmlFor="itemName" className="text-right">
                                                Item Name
                                            </Label>
                                            <Input
                                                id="itemName"
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
                                <Button type="button" onClick={addItem}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className='flex justify-center items-center'>
                    <Table>
                        <TableCaption>A list of scheduled store items</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Item ID</TableHead>
                                <TableHead>Item Name</TableHead>
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
                                                    <DropdownMenuItem onClick={() => deleteItem(item.id)}>Delete</DropdownMenuItem>
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
                        <DialogTitle>Store Item Details</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p><strong>Item ID:</strong> {selectedDetails.item.id}</p>
                        <p><strong>Item Name:</strong> {selectedDetails.item ? `${selectedDetails.item.name} ` : 'Unknown'}</p>
                        <p><strong>Manufacturer:</strong> {selectedDetails.item.manufacturer}</p>
                        <p><strong>Price:</strong> {selectedDetails.item.price}</p>
                        <p><strong>Quantity in Stock:</strong> {selectedDetails.item.amount}</p>
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

export default StoreInventory;
