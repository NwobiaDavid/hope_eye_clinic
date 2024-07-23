/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Table, TableHeader,TableHead, TableRow, TableBody, TableCell } from '../ui/table';

interface CartProps {
  id: number;
}

interface Drug {
  name: string;
}

interface Item {
  name: string;
}

interface Cart {
  drugs: { name: string; quantity: number; patient_id: string }[];
  items: { name: string; quantity: number; patient_id: string }[];
}

interface Purchase {
  drugsBought?: { drug_name: string; quantity: number; purchase_date: string }[];
  itemsBought?: { item_name: string; quantity: number; purchase_date: string }[];
}

const CartComponent: React.FC<CartProps> = ({ id }) => {
  const [cart, setCart] = useState<Cart>({ drugs: [], items: [] });
  const [drugName, setDrugName] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [drugQuantity, setDrugQuantity] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const [patientId, setPatientId] = useState<string>(id.toString());
  const [purchases, setPurchases] = useState<Purchase>({});
  const [drugSearchResults, setDrugSearchResults] = useState<Drug[]>([]);
  const [itemSearchResults, setItemSearchResults] = useState<Item[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setPatientId(id.toString());
  }, [id]);

  const handleAddToCart = async (type: 'drug' | 'item') => {
    const name = type === 'drug' ? drugName : itemName;
    const quantity = type === 'drug' ? drugQuantity : itemQuantity;

    try {
      await axios.post('http://localhost:3000/api/cart', { type, name, quantity, patient_id: patientId });
      setCart(prevCart => ({
        ...prevCart,
        [type === 'drug' ? 'drugs' : 'items']: [
          ...prevCart[type === 'drug' ? 'drugs' : 'items'],
          { name, quantity, patient_id: patientId }
        ]
      }));

      setDrugName('');
      setItemName('');
      if (type === 'drug') {
        setDrugQuantity(0);
      } else {
        setItemQuantity(0);
      }
    } catch (error: any) {
      console.error(error.response?.data?.error);
    }
  };

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get<Drug[]>('http://localhost:3000/api/drugs');
        setDrugs(response.data);
      } catch (error: any) {
        console.error(error.response?.data?.error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get<Item[]>('http://localhost:3000/api/items');
        setItems(response.data);
      } catch (error: any) {
        console.error(error.response?.data?.error);
      }
    };

    fetchDrugs();
    fetchItems();
  }, []);

  const handleDrugSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setDrugName(e.target.value);
    if (drugs.length > 0) {
      const results = drugs.filter(drug => drug.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setDrugSearchResults(results);
    }
  };

  const handleItemSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
    if (items.length > 0) {
      const results = items.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setItemSearchResults(results);
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post('http://localhost:3000/api/checkout', { patient_id: patientId });
      setCart({ drugs: [], items: [] });
      alert('Checkout successful');
    } catch (error: any) {
      console.error(error.response?.data?.error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get<Purchase>(`http://localhost:3000/api/purchases?patient_id=${patientId}`);
      setPurchases(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPurchases();
    }
  }, [patientId]);

  return (
    <div className='bg-orange-50 py-3'>
      <h1 className='p-2 font-semibold text-3xl'>Cart</h1>
      <div className='px-5 py-10'>
        <h2 className='text-xl px-2 py-1 bg-orange-200 rounded-md w-fit'>Add to Cart</h2>

        <div className="flex justify-around p-5">
          <div className='flex w-[40%] flex-col justify-center items-center'>
            <input
              type="text"
              placeholder="Search Drug"
              value={drugName}
              className='rounded-full text-base w-[80%] mb-2 border outline-none px-3 py-2'
              onChange={handleDrugSearch}
            />
            {drugSearchResults.length > 0 && (
              <ul className='text-base w-[50%] bg-orange-400 overflow-hidden mb-2 rounded-md'>
                {drugSearchResults.map((drug, index) => (
                  <li className='p-1 border-b hover:font-semibold hover:bg-orange-700 hover:text-white duration-200 cursor-pointer' key={index} onClick={() => setDrugName(drug.name)}>
                    {drug.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              placeholder="Quantity"
              className='rounded-full w-[80%] text-base border outline-none px-3 py-2'
              value={drugQuantity}
              onChange={(e) => setDrugQuantity(Number(e.target.value))}
            />
            <Button className='mt-5' onClick={() => handleAddToCart('drug')}>Add Drug to Cart</Button>
          </div>

          <div className='flex w-[40%] flex-col justify-center items-center'>
            <input
              type="text"
              placeholder="Search Item"
              className='rounded-full w-[80%] mb-2 text-base border outline-none px-3 py-2'
              value={itemName}
              onChange={handleItemSearch}
            />
            {itemSearchResults.length > 0 && (
              <ul className='text-base w-[50%] bg-orange-400 mb-2 rounded-md overflow-hidden'>
                {itemSearchResults.map((item, index) => (
                  <li className='p-1 hover:font-semibold hover:bg-orange-700 hover:text-white duration-200 cursor-pointer' key={index} onClick={() => setItemName(item.name)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              placeholder="Quantity"
              className='rounded-full w-[80%] text-base border outline-none px-3 py-2'
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <Button className='mt-5' onClick={() => handleAddToCart('item')}>Add Item to Cart</Button>
          </div>
        </div>
      </div>

      <div className='bg-orange-200 mx-5 mb-3 px-3 pt-3 pb-5 rounded-lg'>
        <h2 className='px-2 py-1 bg-orange-300 border-orange-500 border rounded-md w-fit text-xl'>Cart Items</h2>
        <div className='flex justify-around mb-10'>
          <div>
            <h3 className='font-semibold'>Drugs</h3>
            <div className='text-base capitalize'>
              {cart.drugs.length > 0 ? cart.drugs.map((drug, index) => (
                <div key={index}>{drug.name} - Quantity: {drug.quantity}</div>
              )) : ("no drugs added yet")}
            </div>
          </div>

          <div>
            <h3 className='font-semibold'>Items</h3>
            <div className='text-base capitalize'>
              {cart.items.length > 0 ? cart.items.map((item, index) => (
                <div key={index}>{item.name} - Quantity: {item.quantity}</div>
              )) : ("no items added yet")}
            </div>
          </div>
        </div>

        <Button className='mt-5 w-full bg-orange-700' onClick={handleCheckout}>Checkout</Button>
      </div>


      <div className='p-3' >
      <h2 className='px-2 py-1 text-xl border border-orange-500 rounded-md bg-orange-300 w-fit mb-5'>Purchase History</h2>
                <div className="flex justify-around ">
                        <div className=' w-[50%] ' >
                          <h3 className='font-semibold text-center   ' >Drugs Bought</h3>
                                              <Table>
                          <TableHeader>
                                      <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Purchase Date</TableHead>
                                      </TableRow>
                                    </TableHeader>
                          <TableBody>
                              {purchases.drugsBought ? purchases.drugsBought.map((drug, index) => (
                                 <TableRow key={index}>
                                 <TableCell>{drug.drug_name}</TableCell>
                                 <TableCell>{drug.quantity}</TableCell>
                                 <TableCell>{new Date(drug.purchase_date).toLocaleDateString()}</TableCell>
                               </TableRow>
                              )) : (
                                  <h2 className='text-base capitalize opacity-70' > no drug purchase yet </h2>
                              ) }
                          </TableBody>
                                              </Table>
                        </div>
                    
                        <div className='w-[50%] border-l border-orange-600'>
                          <h3  className='font-semibold text-center' >Items Bought</h3>
                          <Table>
                            <TableHeader>
                                        <TableRow>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Quantity</TableHead>
                                          <TableHead>Purchase Date</TableHead>
                                        </TableRow>
                                      </TableHeader>
                            <TableBody>
                                {purchases.itemsBought ? purchases.itemsBought.map((item, index) => (
                                     <TableRow key={index}>
                                     <TableCell>{item.item_name}</TableCell>
                                     <TableCell>{item.quantity}</TableCell>
                                     <TableCell>{new Date(item.purchase_date).toLocaleDateString()}</TableCell>
                                   </TableRow>
                                )) : (
                                    <h2 className='text-base capitalize opacity-70' > no item purchase yet </h2>
                                )}
                            </TableBody>
                          </Table>
                        </div>
                </div>
                </div>
      {/* <div className='mx-5 mb-10'>
        <h2 className='px-2 py-1 text-xl border border-orange-500 rounded-md bg-orange-300 w-fit mb-5'>Purchase History</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchase Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.drugsBought && purchases.drugsBought.map((drug, index) => (
              <TableRow key={index}>
                <TableCell>Drug</TableCell>
                <TableCell>{drug.drug_name}</TableCell>
                <TableCell>{drug.quantity}</TableCell>
                <TableCell>{new Date(drug.purchase_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {purchases.itemsBought && purchases.itemsBought.map((item, index) => (
              <TableRow key={index}>
                <TableCell>Item</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.purchase_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {!purchases.drugsBought && !purchases.itemsBought && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No purchase history available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div> */}

    </div>
  );
};

export default CartComponent;
