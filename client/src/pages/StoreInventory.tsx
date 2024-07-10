import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table"; // Adjust the import path as needed
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Ellipsis, MoreVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const StoreInventory = () => {
    const initialData = [
        { id: "ITEM001", name: "Frame A", type: "Frame", price: "50", quantity: "100", manufacturer: "Company A", dateOfStock: "2024-06-18" },
        { id: "ITEM002", name: "Frame B", type: "Frame", price: "60", quantity: "150", manufacturer: "Company B", dateOfStock: "2024-06-19" },
        { id: "ITEM003", name: "Lens A", type: "Lens", price: "30", quantity: "200", manufacturer: "Company C", dateOfStock: "2024-06-20" },
        { id: "ITEM004", name: "Case A", type: "Case", price: "20", quantity: "50", manufacturer: "Company D", dateOfStock: "2024-06-21" }
    ];

    const [data, setData] = useState(initialData);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("Frame");
    const [newPrice, setNewPrice] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [newManufacturer, setNewManufacturer] = useState("");
    const [newDateOfStock, setNewDateOfStock] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    const handleSave = () => {
        const newItem = {
            id: `ITEM${String(data.length + 1).padStart(3, '0')}`,
            name: newName,
            type: newType,
            price: newPrice,
            quantity: newQuantity,
            manufacturer: newManufacturer,
            dateOfStock: newDateOfStock ? format(newDateOfStock, "yyyy-MM-dd") : "",
        };
        setData([...data, newItem]);
        setNewName("");
        setNewType("Frame");
        setNewPrice("");
        setNewQuantity("");
        setNewManufacturer("");
        setNewDateOfStock(null);
        setIsDialogOpen(false);
    };

    const handleEditSave = () => {
        const updatedData = data.map(item =>
            item.id === editItem.id
                ? {
                      ...item,
                      name: newName,
                      type: newType,
                      price: newPrice,
                      quantity: newQuantity,
                      manufacturer: newManufacturer,
                      dateOfStock: newDateOfStock ? format(newDateOfStock, "yyyy-MM-dd") : "",
                  }
                : item
        );
        setData(updatedData);
        setEditDialogOpen(false);
    };

    const handleEdit = (item: any) => {
        setEditItem(item);
        setNewName(item.name);
        setNewType(item.type);
        setNewPrice(item.price);
        setNewQuantity(item.quantity);
        setNewManufacturer(item.manufacturer);
        setNewDateOfStock(new Date(item.dateOfStock));
        setEditDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
    };

    const columns = [
        { header: "ID", accessorKey: "id" },
        { header: "Name", accessorKey: "name" },
        { header: "Type", accessorKey: "type" },
        { header: "Price", accessorKey: "price" },
        { header: "Quantity", accessorKey: "quantity" },
        { header: "Manufacturer", accessorKey: "manufacturer" },
        { header: "Date of Stock", accessorKey: "dateOfStock" },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div className="px-6 py-3">
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                    <div className="flex justify-between py-4 items-center">
                        <h2 className="py-2 px-4 bg-black text-white rounded-md">Store Inventory</h2>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Add New Item
                        </Button>
                    </div>

                    <DataTable data={data} columns={columns} />

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add a New Item</DialogTitle>
                                    <DialogClose asChild>
                                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                                    </DialogClose>
                                </DialogHeader>
                                <DialogDescription>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="item-name" className="text-right">
                                            Item Name
                                        </Label>
                                        <Input
                                            id="item-name"
                                            placeholder='Item Name'
                                            onChange={(e) => setNewName(e.target.value)}
                                            value={newName}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="item-type" className="text-right">
                                            Type
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="border p-2 rounded-lg">{newType}</DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Item Type</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setNewType("Frame")}>Frame</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewType("Case")}>Case</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewType("Lens")}>Lens</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="item-price" className="text-right">
                                            Price
                                        </Label>
                                        <Input
                                            id="item-price"
                                            placeholder='Price'
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            value={newPrice}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="item-quantity" className="text-right">
                                            Quantity
                                        </Label>
                                        <Input
                                            id="item-quantity"
                                            placeholder='Quantity'
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            value={newQuantity}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="item-manufacturer" className="text-right">
                                            Manufacturer
                                        </Label>
                                        <Input
                                            id="item-manufacturer"
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
                                    <Button onClick={handleSave}>Save</Button>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    )}

                    {editDialogOpen && (
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Item</DialogTitle>
                                    <DialogClose asChild>
                                        <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
                                    </DialogClose>
                                </DialogHeader>
                                <DialogDescription>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-item-name" className="text-right">
                                            Item Name
                                        </Label>
                                        <Input
                                            id="edit-item-name"
                                            placeholder='Item Name'
                                            onChange={(e) => setNewName(e.target.value)}
                                            value={newName}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-item-type" className="text-right">
                                            Type
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="border p-2 rounded-lg">{newType}</DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Item Type</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setNewType("Frame")}>Frame</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewType("Case")}>Case</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewType("Lens")}>Lens</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-item-price" className="text-right">
                                            Price
                                        </Label>
                                        <Input
                                            id="edit-item-price"
                                            placeholder='Price'
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            value={newPrice}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-item-quantity" className="text-right">
                                            Quantity
                                        </Label>
                                        <Input
                                            id="edit-item-quantity"
                                            placeholder='Quantity'
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            value={newQuantity}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-item-manufacturer" className="text-right">
                                            Manufacturer
                                        </Label>
                                        <Input
                                            id="edit-item-manufacturer"
                                            placeholder='Manufacturer'
                                            onChange={(e) => setNewManufacturer(e.target.value)}
                                            value={newManufacturer}
                                            className="col-span-2"
                                        />
                                    </div>
                                    <div className="grid mb-6 grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-date-of-stock" className="text-right">
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
                                    <Button onClick={handleEditSave}>Save</Button>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreInventory;
