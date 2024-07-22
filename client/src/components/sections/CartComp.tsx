import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

const CartComponent = ({id}) => {
    const [cart, setCart] = useState({ drugs: [], items: [] });

    const [drugName, setDrugName] = useState('');
    const [itemName, setItemName] = useState('');

    const [drugQuantity, setDrugQuantity] = useState(0);
    const [itemQuantity, setItemQuantity] = useState(0);
    const [patientId, setPatientId] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [drugSearchResults, setDrugSearchResults] = useState([]);
    const [itemSearchResults, setItemSearchResults] = useState([]);

    const [drugs, setDrugs] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setPatientId(id)
    }, [id])

    const handleAddToCart = async (type) => {
        const name = type === 'drug' ? drugName : itemName;
        const quantity = type === 'drug' ? drugQuantity : itemQuantity;

        try {
            const response = await axios.post('http://localhost:3000/api/cart', { type, name, quantity, patient_id: patientId });
            const data = response.data;
            setCart((prevCart) => ({
                ...prevCart,
                [type === 'drug' ? 'drugs' : 'items']: [...prevCart[type === 'drug' ? 'drugs' : 'items'], { name, quantity, patient_id: patientId }]
            }));
            setDrugName('');
            setItemName('');
            if(type === 'drug'){
                setDrugQuantity(0);
            } else {
                setItemQuantity(0);
            }
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/drugs');
                setDrugs(response.data);
            } catch (error:any) {
                console.error(error.response.data.error);
            }
        };

        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/items');
                setItems(response.data);
            } catch (error:any) {
                console.error(error.response.data.error);
            }
        };

        fetchDrugs();
        fetchItems();
    }, []);


    const handleDrugSearch = (e) => {
        setDrugName(e.target.value);
        if (drugs.length > 0) {
            const results = drugs.filter((drug) => {
                return drug.name.toLowerCase().includes(e.target.value.toLowerCase());
            });
            setDrugSearchResults(results);
        }
    };

    const handleItemSearch = (e) => {
        setItemName(e.target.value);
        if (items.length > 0) {
            const results = items.filter((item) => {
                return item.name.toLowerCase().includes(e.target.value.toLowerCase());
            });
            setItemSearchResults(results);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/checkout', { patient_id: patientId });
            setCart({ drugs: [], items: [] });
            alert('Checkout successful');
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    const fetchPurchases = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/purchases?patient_id=${patientId}`);
            setPurchases(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchPurchases();
        }
    }, [patientId]);

    return (
        <div className='bg-orange-50 py-3 ' >
            <h1 className=' p-2 font-semibold text-3xl'>Cart</h1>
            <div className='px-5 py-10' >
                <h2 className=' text-xl px-2 py-1 bg-orange-200 rounded-md w-fit ' >Add to Cart</h2>
                
                <div className="flex justify-around p-5 ">
                    <div className='flex w-[40%] flex-col justify-center items-center'>
                        <input
                            type="text"
                            placeholder="Search Drug"
                            value={drugName}
                            className='rounded-full text-base w-[80%] mb-2 border outline-none px-3 py-2 '
                            onChange={handleDrugSearch}
                        />
                        {drugSearchResults.length > 0 && (
                            <ul className=' text-base w-[50%] bg-orange-400 overflow-hidden mb-2 rounded-md ' >
                                {drugSearchResults.map((drug, index) => (
                                    <li className=' p-1 border-b hover:font-semibold hover:bg-orange-700 hover:text-white duration-200 cursor-pointer ' key={index} onClick={() => setDrugName(drug.name)}>
                                        {drug.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input
                            type="number"
                            placeholder="Quantity"
                            className='rounded-full w-[80%] text-base border outline-none px-3 py-2 '
                            value={drugQuantity}
                            onChange={(e) => setDrugQuantity(e.target.value)}
                        />
                        <Button className='mt-5 ' onClick={() => handleAddToCart('drug')}>Add Drug to Cart</Button>
                    </div>

                    <div className='flex w-[40%] flex-col justify-center items-center'>
                        <input
                            type="text"
                            placeholder="Search Item"
                            className='rounded-full w-[80%] mb-2 text-base border outline-none px-3 py-2 '
                            value={itemName}
                            onChange={handleItemSearch}
                        />
                        {itemSearchResults.length > 0 && (
                            <ul className=' text-base w-[50%] bg-orange-400 mb-2 rounded-md overflow-hidden ' >
                                {itemSearchResults.map((item, index) => (
                                    <li className=' p-1 hover:font-semibold  hover:bg-orange-700 hover:text-white duration-200 cursor-pointer ' key={index} onClick={() => setItemName(item.name)}>
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
                            onChange={(e) => setItemQuantity(e.target.value)}
                        />
                        <Button className='mt-5 ' onClick={() => handleAddToCart('item')}>Add Item to Cart</Button>
                    </div>
                </div>
            </div>

            <div className=' bg-orange-200 mx-5 mb-3 px-3 pt-3 pb-5 rounded-lg ' >
                <h2 className='  px-2 py-1 bg-orange-300 border-orange-500 border rounded-md w-fit   text-xl' >Cart Items</h2>
                <div className='flex justify-around mb-10 '>
                    <div>
                        <h3 className=' font-semibold ' >Drugs</h3>
                        <div className='text-base capitalize ' >
                            { cart.drugs.length > 0 ? cart.drugs.map((drug, index) => (
                                <div key={index}>{drug.name} - Quantity: {drug.quantity}</div>
                            )) : ("no drug added") }
                        </div>
                    </div>
                    <div className=' ' >
                        <h3 className=' font-semibold ' >Items</h3>
                        <div className='text-base capitalize ' >
                            { cart.items.length > 0 ? cart.items.map((item, index) => (
                                <div key={index}>{item.name} - Quantity: {item.quantity}</div>
                            )) : ( "no item added" )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center "><Button onClick={handleCheckout}>Checkout</Button></div>
            </div>

            <div className='p-3' >
                <h2 className="px-2 py-1 bg-orange-200 rounded-md w-fit   text-xl" >Purchases</h2>
                <div className="flex justify-around ">
                    <div>
                        <h3 className='font-semibold' >Drugs Bought</h3>
                        <ul>
                            {purchases.drugsBought ? purchases.drugsBought.map((drug, index) => (
                                <li className=' text-lg ' key={index}>{drug.drug_name} <span className="text-white px-1 text-xl font-bold bg-orange-500 rounded-lg "> -</span> Quantity: {drug.quantity} <span className="text-white px-1 text-xl font-bold bg-orange-500 rounded-lg "> -</span> Date: {new Date(drug.purchase_date).toLocaleDateString()}</li>
                            )) : (
                                <h2 className='text-base capitalize opacity-70' > no drug purchase yet </h2>
                            ) }
                        </ul>
                    </div>
                    
                    <div>
                        <h3  className='font-semibold' >Items Bought</h3>
                        <ul>
                            {purchases.itemsBought ? purchases.itemsBought.map((item, index) => (
                                <li className=' text-lg ' key={index}>{item.item_name} <span className="text-white px-1 text-xl font-bold bg-orange-500 rounded-lg "> -</span> Quantity: {item.quantity} <span className="text-white px-1 text-xl font-bold bg-orange-500 rounded-lg "> -</span> Date: {new Date(item.purchase_date).toLocaleDateString()}</li>
                            )) : (
                                <h2 className='text-base capitalize opacity-70' > no item purchase yet </h2>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartComponent;
