import { useState } from 'react';
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

const DrugInventory = () => {
    const initialData = [
        { id: "DRUG001", name: "Aspirin", price: "10", quantity: "100", manufacturer: "Pharma Inc.", dateOfStock: "2024-06-18" }
    ];

    const [data, setData] = useState(initialData);
    const [cart, setCart] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [newDrugName, setNewDrugName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [newManufacturer, setNewManufacturer] = useState("");
    const [newDateOfStock, setNewDateOfStock] = useState<Date>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSave = () => {
        const newDrug = {
            id: `DRUG${String(data.length + 1).padStart(3, '0')}`,
            name: newDrugName,
            price: newPrice,
            quantity: newQuantity,
            manufacturer: newManufacturer,
            dateOfStock: newDateOfStock ? format(newDateOfStock, "yyyy-MM-dd") : "",
        };
        setData([...data, newDrug]);
        setNewDrugName("");
        setNewPrice("");
        setNewQuantity("");
        setNewManufacturer("");
        setNewDateOfStock(undefined);
        setIsDialogOpen(false);
    };

    const addToCart = (drug) => {
        if (!patientName) {
            alert("Please enter the patient's name.");
            return;
        }
        const cartItem = { ...drug, patientName };
        setCart([...cart, cartItem]);
        setPatientName(""); // Clear the patient name after adding to cart
    };

    const handlePayment = () => {
        // Implement payment logic here
        alert("Payment Successful!");
        setCart([]);
    };

    const handlePrintReceipt = () => {
        // Implement print receipt logic here
        const receiptContent = cart.map(item => `Patient: ${item.patientName}\nDrug: ${item.name} - $${item.price}`).join("\n\n");
        const receiptWindow = window.open("", "Receipt", "width=600,height=400");
        receiptWindow.document.write(`<pre>${receiptContent}</pre>`);
        receiptWindow.document.close();
        receiptWindow.print();
    };

    return (
        <div className="px-6 py-3">
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <div className="flex justify-between py-4 items-center">
                        <h2 className="py-2 px-4 bg-black text-white rounded-md">Drug Inventory</h2>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Add New Drug
                        </Button>
                    </div>

                    <Table>
                        <TableCaption>A list of drugs in inventory</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name of Drug</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity in Stock</TableHead>
                                <TableHead>Manufacturer</TableHead>
                                <TableHead className="text-right">Date of Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{item.price}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell>{item.manufacturer}</TableCell>
                                    <TableCell className="text-right">{item.dateOfStock}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add a New Drug</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="drug-name" className="text-right">
                                            Name of Drug
                                        </Label>
                                        <Input
                                            id="drug-name"
                                            placeholder='Name of Drug'
                                            onChange={(e) => setNewDrugName(e.target.value)}
                                            value={newDrugName}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">
                                            Price
                                        </Label>
                                        <Input
                                            id="price"
                                            placeholder='Price'
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            value={newPrice}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="quantity" className="text-right">
                                            Quantity in Stock
                                        </Label>
                                        <Input
                                            id="quantity"
                                            placeholder='Quantity in Stock'
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            value={newQuantity}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="manufacturer" className="text-right">
                                            Manufacturer
                                        </Label>
                                        <Input
                                            id="manufacturer"
                                            placeholder='Manufacturer'
                                            onChange={(e) => setNewManufacturer(e.target.value)}
                                            value={newManufacturer}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="date-of-stock" className="text-right">
                                            Date of Stock
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !newDateOfStock && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newDateOfStock ? format(newDateOfStock, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={newDateOfStock}
                                                    onSelect={setNewDateOfStock}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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

                    <div className="mt-6">
                        <h3 className="py-2 px-4 bg-black text-white rounded-md">Cart</h3>
                        <div className="mb-4">
                            <Label htmlFor="patient-name" className="text-right">
                                Patient Name
                            </Label>
                            <Input
                                id="patient-name"
                                placeholder="Enter patient's name"
                                onChange={(e) => setPatientName(e.target.value)}
                                value={patientName}
                            />
                        </div>
                        <Table>
                            <TableCaption>A list of selected drugs</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Name of Drug</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.patientName}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between mt-4">
                            <Button onClick={handlePayment}>Pay</Button>
                            <Button onClick={handlePrintReceipt}>Print Receipt</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrugInventory;
